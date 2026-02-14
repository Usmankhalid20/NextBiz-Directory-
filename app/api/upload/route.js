import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import UploadLog from '@/models/UploadLog';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { jwtVerify } from 'jose';
import { logActivity } from '@/lib/audit';

async function checkAdmin(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return { isAdmin: payload.role === 'admin', adminId: payload.id };
    } catch {
        return false;
    }
}

export async function POST(req) {
  try {
    const auth = await checkAdmin(req);
    if (!auth || !auth.isAdmin) {
         return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    let results = [];

    // Parse CSV or JSON based on file type
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text();
        const jsonData = JSON.parse(text);
        results = Array.isArray(jsonData) ? jsonData : [jsonData];
    } else {
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);
        
        await new Promise((resolve, reject) => {
            stream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', resolve)
                .on('error', reject);
        });
    }

    await connectToDatabase();

    // Transform contents
    const operations = results.map((data) => {
        const business = {
            placeId: data.placeId || data['Place ID'],
            businessName: data.businessName || data['Business Name'],
            address: data.address || data['Address'],
            category: data.category || data['Category'],
            description: data.description || data['Description'] || '',
            city: data.city || data['City'] || '',
            state: data.state || data['State'] || '',
            zip: data.zip || data['Zip'] || '',
            phone: data.phone || data['Phone Number'] || '',
            website: data.website || data['Website'] || '',
            rating: parseFloat(data.rating || data['Rating'] || 0),
            reviewCount: parseInt(data.reviewCount || data['Review Count'] || 0),
            isOpenNow: String(data.isOpenNow || data['Is Open Now']).toLowerCase() === 'true',
            images: typeof data.images === 'string' ? data.images.split(',') : (Array.isArray(data.images) ? data.images : []),
            tags: typeof data.tags === 'string' ? data.tags.split(',') : (Array.isArray(data.tags) ? data.tags : []),
            createdBy: auth.adminId, // Track creator
            lastModifiedBy: auth.adminId
        };

        if (!business.placeId || !business.businessName) return null;

        return {
            updateOne: {
                filter: { placeId: business.placeId },
                update: { $set: business },
                upsert: true,
            },
        };
    }).filter(op => op !== null);

    let processedCount = operations.length;
    let failedCount = results.length - processedCount;

    if (operations.length > 0) {
        await Business.bulkWrite(operations);
    }

    // Create Upload Log
    await UploadLog.create({
        fileName: file.name,
        uploadedBy: auth.adminId,
        recordsInserted: processedCount,
        recordsFailed: failedCount,
        status: 'COMPLETED' // simplified for now
    });

    // Log Activity
    await logActivity({
        action: 'UPLOAD_CSV',
        details: `Uploaded file ${file.name}. Processed: ${processedCount}, Failed: ${failedCount}`,
        performedBy: auth.adminId,
        metadata: { fileName: file.name, count: processedCount }
    });

    return NextResponse.json({ 
        success: true, 
        message: `Successfully processed ${operations.length} records.`,
        stats: {
            processed: results.length,
            added: operations.length,
            failed: failedCount
        }
    }, { status: 200 });

  } catch (error) {
    console.error('Upload Error:', error);
    
    // Attempt to log failure if auth was successful (complex to pass auth here without try/catch scope, but skipping for simplicity)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const results = [];

    const stream = Readable.from(buffer);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => {
            // Map CSV columns to Schema fields
            const business = {
                placeId: data['Place ID'] || data['placeId'],
                businessName: data['Business Name'] || data['businessName'],
                description: data['Description'] || data['description'] || '',
                address: data['Address'] || data['address'],
                city: data['City'] || data['city'] || '',
                state: data['State'] || data['state'] || '',
                zip: data['Zip'] || data['zip'] || '',
                phone: data['Phone Number'] || data['phone'] || '',

                website: data['Website'] || data['website'] || '',
                category: data['Category'] || data['category'],
                rating: parseFloat(data['Rating'] || data['rating'] || 0),
                reviewCount: parseInt(data['Review Count'] || data['reviewCount'] || 0),
                isOpenNow: (data['Is Open Now'] || data['isOpenNow'])?.toLowerCase() === 'yes' || (data['Is Open Now'] || data['isOpenNow']) === 'true',
                // Handle lat/lng if available, otherwise default to 0,0
                location: {
                    type: 'Point',
                    coordinates: [
                        parseFloat(data['Longitude'] || data['longitude'] || 0),
                        parseFloat(data['Latitude'] || data['latitude'] || 0)
                    ]
                },
                images: data['Images'] ? data['Images'].split(',').map(img => img.trim()) : [],
                tags: data['Tags'] ? data['Tags'].split(',').map(tag => tag.trim()) : [],
            };
             // Basic validation to skip empty rows
            if (business.placeId || (business.businessName && business.address)) {
                results.push(business);
            }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await connectToDatabase();

    // Insert or update
    // Insert or update
    const operations = results.map((business) => ({
      updateOne: {
        filter: { placeId: business.placeId }, // Use placeId as unique identifier
        update: { $set: business },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
        await Business.bulkWrite(operations);
    }

    return NextResponse.json({ success: true, count: results.length, message: 'Data uploaded successfully' }, { status: 200 });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

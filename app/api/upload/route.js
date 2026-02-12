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
            // Assuming CSV headers match or are close. We'll try to be robust.
            const business = {
                placeId: data['Place ID'] || data['placeId'],
                businessName: data['Business Name'] || data['businessName'],
                address: data['Address'] || data['address'],
                phone: data['Phone Number'] || data['phone'],

                website: data['Website'] || data['website'],


                category: data['Category'] || data['category'],
                isOpenNow: (data['Is Open Now'] || data['isOpenNow'])?.toLowerCase() === 'yes' || (data['Is Open Now'] || data['isOpenNow']) === 'true',
            };
            results.push(business);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    await connectToDatabase();

    // Insert or update
    const operations = results.map((business) => ({
      updateOne: {
        filter: { placeId: business.placeId },
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

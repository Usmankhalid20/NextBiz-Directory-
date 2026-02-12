import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';

export async function GET() {
  try {
    await connectToDatabase();
    const businesses = await Business.find({}).sort({ createdAt: -1 }); // Newest first
    return NextResponse.json({ success: true, data: businesses }, { status: 200 });
  } catch (error) {
    console.error('Fetch Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

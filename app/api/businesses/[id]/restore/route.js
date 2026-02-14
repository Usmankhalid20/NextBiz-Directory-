import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { jwtVerify } from 'jose';

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    
    // Auth Check
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify Admin
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        if (payload.role !== 'admin') {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
    } catch {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const business = await Business.findByIdAndUpdate(
        id,
        { 
            isDeleted: false,
            deletedAt: null
        },
        { new: true }
    );

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Business has been restored' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

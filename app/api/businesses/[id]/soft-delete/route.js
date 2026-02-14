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

    // Verify User (Any authenticated user can soft delete)
    // We could check ownership if users owned businesses, but requirement says "Users... can soft delete".
    // Assuming any logged in user can soft delete any business.
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
    } catch {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    await connectToDatabase();

    const business = await Business.findByIdAndUpdate(
        id,
        { 
            isDeleted: true,
            deletedAt: new Date()
        },
        { new: true }
    );

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Business removed from view' });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}

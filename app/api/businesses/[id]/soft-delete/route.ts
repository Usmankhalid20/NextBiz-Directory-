import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { jwtVerify } from 'jose';
import { HTTP_STATUS, MESSAGES } from '@/lib/constants';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Auth Check
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: MESSAGES.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    // Verify User (Any authenticated user can soft delete)
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        await jwtVerify(token, secret);
    } catch {
        return NextResponse.json({ message: 'Invalid token' }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    await connectToDatabase();

    // @ts-ignore
    const business = await Business.findByIdAndUpdate(
        id,
        { 
            isDeleted: true,
            deletedAt: new Date()
        },
        { new: true }
    );

    if (!business) {
      return NextResponse.json({ message: 'Business not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    return NextResponse.json({ success: true, message: 'Business removed from view' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

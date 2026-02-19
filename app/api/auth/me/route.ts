import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { HTTP_STATUS } from '@/lib/constants';

// Force dynamic rendering since we depend on cookies
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: HTTP_STATUS.OK });
    }

    if (!process.env.JWT_SECRET) {
         throw new Error('JWT_SECRET is not defined'); 
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    // Fetch user (exclude password)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
       return NextResponse.json({ success: false, user: null }, { status: HTTP_STATUS.OK });
    }

    return NextResponse.json({ success: true, user }, { status: HTTP_STATUS.OK });

  } catch (error) {
    // Token invalid or expired
    return NextResponse.json({ success: false, user: null }, { status: HTTP_STATUS.OK });
  }
}

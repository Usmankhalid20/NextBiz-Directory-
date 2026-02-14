import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

// We need to use Node runtime for mongoose, so we can't use Edge runtime here efficiently for DB access
// But we can verify token.

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 200 }); // Not error, just no user
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
        return NextResponse.json({ success: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch {
    return NextResponse.json({ success: false, user: null }, { status: 200 });
  }
}

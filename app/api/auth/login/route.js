import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide email and password' }, { status: 400 });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    // Create Token
    const token = jwt.sign({ 
        userId: user._id, 
        role: user.role,
        hasDataAccess: user.hasDataAccess || false // Include in token, default to false
    }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hasDataAccess: user.hasDataAccess || false, // Return to client, default to false
      },
      message: 'Logged in successfully',
    });

    // Set Cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

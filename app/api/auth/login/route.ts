import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { loginSchema } from '@/lib/validations/auth';
import { HTTP_STATUS, MESSAGES } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    
    // Validate input using Zod
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation Error', 
          errors: validationResult.error.flatten().fieldErrors 
        }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    const { email, password } = validationResult.data;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' }, 
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' }, 
        { status: HTTP_STATUS.UNAUTHORIZED }
      );
    }

    // Ensure JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Create Token
    const token = jwt.sign({ 
        userId: user._id, 
        role: user.role,
        hasDataAccess: user.hasDataAccess // Include in token
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
        hasDataAccess: user.hasDataAccess,
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

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || MESSAGES.INTERNAL_ERROR }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { signupSchema } from '@/lib/validations/auth';
import { HTTP_STATUS, MESSAGES } from '@/lib/constants';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Validate input using Zod
    const validationResult = signupSchema.safeParse(body);

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

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json(
        { success: false, message: 'User already exists' }, 
        { status: HTTP_STATUS.BAD_REQUEST }
      );
    }

    // Create user
    // Role defaults to 'user', hasDataAccess defaults to true in Schema
    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'User registered successfully',
      },
      { status: HTTP_STATUS.CREATED }
    );

  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || MESSAGES.INTERNAL_ERROR }, 
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { jwtVerify } from 'jose';

// Helper to check admin role
async function checkAdmin(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        // @ts-ignore
        return payload.role === 'admin';
    } catch {
        return false;
    }
}

export async function GET(req: NextRequest) {
    if (!await checkAdmin(req)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectToDatabase();
        // Exclude password, sort by newest
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: users });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

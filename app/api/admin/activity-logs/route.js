import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { jwtVerify } from 'jose';
import User from '@/models/User'; // Ensure User model is loaded for populate

async function checkAdmin(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload.role === 'admin';
    } catch {
        return false;
    }
}

export async function GET(req) {
    if (!await checkAdmin(req)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const logs = await ActivityLog.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('performedBy', 'name email');

        const total = await ActivityLog.countDocuments({});

        return NextResponse.json({
            success: true,
            data: logs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

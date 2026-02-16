import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import UploadLog from '@/models/UploadLog';
import { jwtVerify } from 'jose';
// @ts-ignore
import User from '@/models/User'; 

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
        // Uploads doesn't need heavy pagination usually, but let's just return all sorted by date
        // or maybe last 50
        const logs = await UploadLog.find({})
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('uploadedBy', 'name email');

        return NextResponse.json({ success: true, data: logs });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

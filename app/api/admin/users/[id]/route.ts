import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { jwtVerify } from 'jose';
import { logActivity } from '@/lib/audit';

interface AuthCheck {
    isAdmin: boolean;
    adminId?: string;
}

async function checkAdmin(req: NextRequest): Promise<AuthCheck | false> {
    const token = req.cookies.get('token')?.value;
    if (!token) return false;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        // @ts-ignore
        return { isAdmin: payload.role === 'admin', adminId: payload.id as string }; 
    } catch {
        return false;
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await checkAdmin(req);
    if (!auth || !auth.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    try {
        await connectToDatabase();
        const user = await User.findById(id).select('-password');
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await checkAdmin(req);
    if (!auth || !auth.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    try {
        const { hasDataAccess, role } = await req.json();
        await connectToDatabase();

        const updateData: any = {};
        if (typeof hasDataAccess !== 'undefined') updateData.hasDataAccess = hasDataAccess;
        if (role) updateData.role = role;

        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // Log activity
        await logActivity({
            action: role ? 'USER_PROMOTE' : 'USER_UPDATE',
            details: `Updated user ${user.email}. Role: ${user.role}, Access: ${user.hasDataAccess}`,
            performedBy: auth.adminId as string,
            targetId: user._id.toString(),
            targetModel: 'User',
            metadata: { updateData }
        });

        return NextResponse.json({ success: true, data: user, message: 'User updated successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await checkAdmin(req);
    if (!auth || !auth.isAdmin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }
    
    const { id } = await params;

    try {
        await connectToDatabase();
        const userToDelete = await User.findById(id);

        if (!userToDelete) {
             return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        await User.findByIdAndDelete(id);

        // Log activity
        await logActivity({
            action: 'USER_DELETE',
            details: `Deleted user ${userToDelete.email}`,
            performedBy: auth.adminId as string,
            targetId: id,
            targetModel: 'User'
        });

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

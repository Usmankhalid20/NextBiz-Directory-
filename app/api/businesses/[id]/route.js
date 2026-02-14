import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { jwtVerify } from 'jose'; // Using jose for consistency
import { logActivity } from '@/lib/audit';

// Helper to get user/admin info from token
async function getAuth(req) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload; // { id, role, ... }
    } catch {
        return null;
    }
}

export async function PATCH(req, { params }) {
    try {
        const auth = await getAuth(req);
        if (!auth) {
             return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Only admin can restore or user who owns it? For now assume admin for restore.
        // User request says "Admin should be able to... restore".
        if (auth.role !== 'admin') {
             return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        await connectToDatabase();
        
        // Handle Restore
        if (body.restore) {
             const business = await Business.findById(id).setOptions({ includeDeleted: true });
             
             if (!business) return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });

             await business.restore();

             await logActivity({
                action: 'RESTORE_BUSINESS',
                details: `Restored business: ${business.businessName}`,
                performedBy: auth.id,
                targetId: business._id,
                targetModel: 'Business'
            });

             return NextResponse.json({ success: true, data: business, message: 'Business restored' });
        }

        // Handle other updates (e.g. edit)
        const business = await Business.findByIdAndUpdate(
            id,
            { ...body, lastModifiedBy: auth.id },
            { new: true }
        );

        if (!business) return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
        
        await logActivity({
            action: 'UPDATE_BUSINESS',
            details: `Updated business: ${business.businessName}`,
            performedBy: auth.id,
            targetId: business._id,
            targetModel: 'Business',
            metadata: { updates: body }
        });

        return NextResponse.json({ success: true, data: business });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    
    const auth = await getAuth(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
    }

    if (auth.role !== 'admin') {
         return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get('hard_delete') === 'true';

    const business = await Business.findById(id).setOptions({ includeDeleted: true });
    if (!business) {
        return NextResponse.json({ success: false, message: 'Business not found' }, { status: 404 });
    }

    if (hardDelete) {
        await business.deleteOne(); // Hard delete
        
        await logActivity({
            action: 'HARD_DELETE_BUSINESS',
            details: `Permanently deleted business: ${business.businessName}`,
            performedBy: auth.id,
            targetId: id, // ID is gone, but we keep it in logs
            targetModel: 'Business'
        });

        return NextResponse.json({ success: true, message: 'Business permanently deleted' }, { status: 200 });
    } else {
        // Soft Delete using plugin method
        await business.softDelete(auth.id);

        await logActivity({
            action: 'DELETE_BUSINESS',
            details: `Soft deleted business: ${business.businessName}`,
            performedBy: auth.id,
            targetId: business._id,
            targetModel: 'Business'
        });

        return NextResponse.json({ success: true, message: 'Business soft deleted' }, { status: 200 });
    }

  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

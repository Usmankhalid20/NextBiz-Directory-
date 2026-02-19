import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Business from '@/models/Business';
import { jwtVerify } from 'jose'; 
import { logActivity } from '@/lib/audit';
import { businessSchema } from '@/lib/validations/business';
import { HTTP_STATUS, MESSAGES } from '@/lib/constants';

// Helper to get user/admin info from token
async function getAuth(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        // @ts-ignore
        const { payload } = await jwtVerify(token, secret);
        return payload; // { id, role, ... }
    } catch {
        return null;
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await getAuth(req);
        if (!auth) {
             return NextResponse.json({ success: false, message: MESSAGES.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
        }

        // Only admin can restore or user who owns it? For now assume admin for restore.
        // @ts-ignore
        if (auth.role !== 'admin') {
             return NextResponse.json({ success: false, message: MESSAGES.FORBIDDEN }, { status: HTTP_STATUS.FORBIDDEN });
        }

        const { id } = await params;
        const body = await req.json();

        await connectToDatabase();
        
        // Handle Restore
        if (body.restore) {
             // @ts-ignore
             const business = await Business.findById(id).setOptions({ includeDeleted: true });
             
             if (!business) return NextResponse.json({ success: false, message: 'Business not found' }, { status: HTTP_STATUS.NOT_FOUND });

             // @ts-ignore
             await business.restore();

             await logActivity({
                action: 'RESTORE_BUSINESS',
                details: `Restored business: ${business.businessName}`,
                // @ts-ignore
                performedBy: auth.id || auth.userId,
                targetId: business._id.toString(),
                targetModel: 'Business'
            });

             return NextResponse.json({ success: true, data: business, message: 'Business restored' });
        }

        // Validate Update Data (Partial)
        const validationResult = businessSchema.partial().safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { success: false, message: 'Validation Error', errors: validationResult.error.flatten().fieldErrors },
                { status: HTTP_STATUS.BAD_REQUEST }
            );
        }

        // Handle other updates (e.g. edit)
        const business = await Business.findByIdAndUpdate(
            id,
            // @ts-ignore
            { ...validationResult.data, lastModifiedBy: auth.id || auth.userId },
            { new: true }
        );

        if (!business) return NextResponse.json({ success: false, message: 'Business not found' }, { status: HTTP_STATUS.NOT_FOUND });
        
        await logActivity({
            action: 'UPDATE_BUSINESS',
            details: `Updated business: ${business.businessName}`,
            // @ts-ignore
            performedBy: auth.id || auth.userId,
            targetId: business._id.toString(),
            targetModel: 'Business',
            metadata: { updates: validationResult.data }
        });

        return NextResponse.json({ success: true, data: business });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const auth = await getAuth(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: MESSAGES.UNAUTHORIZED }, { status: HTTP_STATUS.UNAUTHORIZED });
    }

    // @ts-ignore
    if (auth.role !== 'admin') {
         return NextResponse.json({ success: false, message: MESSAGES.FORBIDDEN }, { status: HTTP_STATUS.FORBIDDEN });
    }

    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const hardDelete = searchParams.get('hard_delete') === 'true';

    // @ts-ignore
    const business = await Business.findById(id).setOptions({ includeDeleted: true });
    if (!business) {
        return NextResponse.json({ success: false, message: 'Business not found' }, { status: HTTP_STATUS.NOT_FOUND });
    }

    if (hardDelete) {
        await business.deleteOne(); // Hard delete
        
        await logActivity({
            action: 'HARD_DELETE_BUSINESS',
            details: `Permanently deleted business: ${business.businessName}`,
            // @ts-ignore
            performedBy: auth.id || auth.userId,
            targetId: id, 
            targetModel: 'Business'
        });

        return NextResponse.json({ success: true, message: 'Business permanently deleted' }, { status: HTTP_STATUS.OK });
    } else {
        // Soft Delete using plugin method
        // @ts-ignore
        await business.softDelete(auth.id || auth.userId);

        await logActivity({
            action: 'DELETE_BUSINESS',
            details: `Soft deleted business: ${business.businessName}`,
            // @ts-ignore
            performedBy: auth.id || auth.userId,
            targetId: business._id.toString(),
            targetModel: 'Business'
        });

        return NextResponse.json({ success: true, message: 'Business soft deleted' }, { status: HTTP_STATUS.OK });
    }

  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}

import ActivityLog from '@/models/ActivityLog';
import dbConnect from '@/lib/mongodb';

interface LogActivityParams {
  action: string;
  details: string;
  performedBy: string;
  targetId?: string;
  targetModel?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity({
  action,
  details,
  performedBy,
  targetId = undefined,
  targetModel = undefined,
  metadata = {},
  ipAddress = '',
  userAgent = '',
}: LogActivityParams) {
  try {
    await dbConnect();

    await ActivityLog.create({
      action,
      details,
      performedBy,
      targetId,
      targetModel,
      metadata,
      ipAddress,
      userAgent,
    });
  } catch (error) {
    console.error('Failed to create activity log:', error);
  }
}

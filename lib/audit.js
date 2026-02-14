import ActivityLog from '@/models/ActivityLog';
import dbConnect from '@/lib/mongodb';

/**
 * Logs a user activity.
 *
 * @param {Object} params - The parameters for the log.
 * @param {string} params.action - The action performed (e.g., 'LOGIN', 'CREATE_BUSINESS').
 * @param {string} params.details - Description of the action.
 * @param {string} params.performedBy - User ID of the person performing the action.
 * @param {string} [params.targetId] - ID of the target object (Business or User).
 * @param {string} [params.targetModel] - Model name of the target object ('Business' or 'User').
 * @param {Object} [params.metadata] - Additional data to store.
 * @param {string} [params.ipAddress] - IP address of the user.
 * @param {string} [params.userAgent] - User agent string.
 */
export async function logActivity({
  action,
  details,
  performedBy,
  targetId = null,
  targetModel = null,
  metadata = {},
  ipAddress = '',
  userAgent = '',
}) {
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
    // We don't want to block the main flow if logging fails, so we just log the error
  }
}

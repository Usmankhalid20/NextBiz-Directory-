import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'CREATE_BUSINESS', 'UPDATE_BUSINESS', 'DELETE_BUSINESS', 'RESTORE_BUSINESS', 'HARD_DELETE_BUSINESS', 'UPLOAD_CSV', 'USER_UPDATE', 'USER_DELETE', 'USER_PROMOTE'],
  },
  details: {
    type: String, 
    required: true,
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId, // ID of the business or user being affected
  },
  targetModel: {
    type: String,
    enum: ['Business', 'User'],
  },
  metadata: {
    type: Object, // Any additional data (e.g., changes made)
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: true,
});

// Index for faster queries
ActivityLogSchema.index({ performedBy: 1, action: 1 });
ActivityLogSchema.index({ createdAt: -1 });

export default mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

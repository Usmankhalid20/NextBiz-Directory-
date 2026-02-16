import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IActivityLog extends Document {
  action: string;
  details?: string;
  performedBy: mongoose.Types.ObjectId;
  targetId?: string;
  targetModel?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  action: {
    type: String,
    required: true,
    index: true,
  },
  details: {
    type: String,
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  targetId: {
    type: String,
    index: true,
  },
  targetModel: {
    type: String,
  },
  metadata: {
    type: Object,
  },
  ipAddress: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // Only createdAt
});

const ActivityLog: Model<IActivityLog> = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

export default ActivityLog;

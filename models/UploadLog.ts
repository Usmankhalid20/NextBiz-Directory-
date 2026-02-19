import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUploadLog extends Document {
  fileName: string;
  uploadedBy: mongoose.Types.ObjectId;
  recordsInserted: number;
  recordsFailed: number;
  failedRecordsDetails?: any[];
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const UploadLogSchema = new Schema<IUploadLog>({
  fileName: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recordsInserted: {
    type: Number,
    default: 0,
  },
  recordsFailed: {
    type: Number,
    default: 0,
  },
  failedRecordsDetails: {
    type: [Object],
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

const UploadLog: Model<IUploadLog> = mongoose.models.UploadLog || mongoose.model<IUploadLog>('UploadLog', UploadLogSchema);

export default UploadLog;

import mongoose from 'mongoose';

const UploadLogSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: [Object], // Store details of failed records
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

export default mongoose.models.UploadLog || mongoose.model('UploadLog', UploadLogSchema);

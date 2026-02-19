import mongoose, { Schema, Document, Model } from 'mongoose';
import softDeletePlugin from './plugins/softDelete';
import { IBusiness } from '@/types';

// Extend the interface for Mongoose Document properties
export interface IBusinessDocument extends Omit<IBusiness, '_id'>, Document {}

const BusinessSchema = new Schema<IBusinessDocument>({
  placeId: {
    type: String,
    required: [true, 'Please provide a Place ID'],
    unique: true,
  },
  businessName: {
    type: String,
    required: [true, 'Please provide a Business Name'],
    index: true,
  },
  description: {
    type: String,
  },
  address: {
    type: String,
    required: [true, 'Please provide an Address'],
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  phone: {
    type: String,
  },
  website: {
    type: String,
  },
  category: {
    type: String,
    index: true,
  },
  rating: {
    type: Number,
    default: 0,
    index: true,
  },
  reviewCount: {
    type: Number,
    default: 0,
    index: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // [longitude, latitude]
    },
  },
  isOpenNow: {
    type: Boolean,
    default: false,
  },
  images: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  lastModifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Create indexes
BusinessSchema.index({ businessName: 'text', description: 'text', category: 'text', tags: 'text' });
BusinessSchema.index({ location: '2dsphere' });

BusinessSchema.plugin(softDeletePlugin);

// Force recompilation in dev to ensure plugin is applied
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Business) {
        delete mongoose.models.Business;
    }
}

const Business: Model<IBusinessDocument> = mongoose.models.Business || mongoose.model<IBusinessDocument>('Business', BusinessSchema);

export default Business;

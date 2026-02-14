import mongoose from 'mongoose';
import softDeletePlugin from './plugins/softDelete';

const BusinessSchema = new mongoose.Schema({
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
  },
  tags: {
    type: [String],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
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
// (This fixes the issue where cached model lacks the new softDelete method)
if (process.env.NODE_ENV === 'development') {
    if (mongoose.models.Business) {
        delete mongoose.models.Business;
    }
}

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);

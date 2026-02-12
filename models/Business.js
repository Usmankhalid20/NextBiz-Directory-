import mongoose from 'mongoose';

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
}, {
  timestamps: true,
});

// Create indexes
BusinessSchema.index({ businessName: 'text', description: 'text', category: 'text', tags: 'text' });
BusinessSchema.index({ location: '2dsphere' });

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);

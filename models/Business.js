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
  },
  address: {
    type: String,
    required: [true, 'Please provide an Address'],
  },
  phone: {
    type: String,
  },

  website: {
    type: String,
  },


  category: {
    type: String,
  },
  isOpenNow: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);

import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['sale', 'rent'],
    },
    ownerType: {
      type: String,
      required: true,
      enum: ['individual', 'company', 'government', 'trust'],
    },
    // Owner contact details
    ownerName: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: true,
    },
    ownerPhone: {
      type: String,
      required: true,
    },
    plotArea: {
      type: Number,
      required: true,
      min: 1,
    },
    // Sale-specific fields
    pricePerSqft: {
      type: Number,
      required: function() { return this.type === 'sale'; },
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: function() { return this.type === 'sale'; },
      min: 1,
    },
    // Rent-specific fields
    monthlyRent: {
      type: Number,
      required: function() { return this.type === 'rent'; },
      min: 1,
    },
    deposit: {
      type: Number,
      required: function() { return this.type === 'rent'; },
      min: 1,
    },
    possessionDate: {
      type: Date,
      required: function() { return this.type === 'rent'; },
    },
    boundaryWall: {
      type: Boolean,
      required: true,
      default: false,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    imageUrls: {
      type: Array,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    adminNotes: {
      type: String,
      default: ''
    },
    approvedBy: {
      type: String,
      default: null
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;

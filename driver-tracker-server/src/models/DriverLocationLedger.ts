import mongoose from 'mongoose';

const driverLocationLedgerSchema = new mongoose.Schema({
  driverId: { type: String, required: true, index: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  timestamp: { type: Date, default: Date.now },
});

driverLocationLedgerSchema.index({ location: '2dsphere' });

export const DriverLocationLedger = mongoose.model('LocationLedger', driverLocationLedgerSchema);
import mongoose from 'mongoose';

const driverCurrentLocationSchema = new mongoose.Schema({
  driverId: { type: String, required: true, unique: true, index: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: { type: [Number], required: true },
  },
  version: { type: Number, required: true, default: 1 },
  updatedAt: { type: Date, default: Date.now },
});

driverCurrentLocationSchema.index({ location: '2dsphere' });

export const DriverCurrentLocation = mongoose.model('CurrentLocation', driverCurrentLocationSchema);
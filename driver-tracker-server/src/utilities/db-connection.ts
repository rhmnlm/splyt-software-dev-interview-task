import mongoose from 'mongoose';
// import { DriverLocation } from '../models/DriverLocation';

export async function connectToDatabase() {
  const mongoUrl = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017';
  console.log(mongoUrl);
  await mongoose.connect(mongoUrl, {
    dbName: 'driver-tracker',        // Optional: separate DB name
    // authSource: 'admin',    // Required for root auth
  });

  console.log('✅ Connected to MongoDB');
}
import { DriverCurrentLocation } from '../models/DriverCurrentLocation';
import { DriverLocationLedger } from '../models/DriverLocationLedger';

export async function updateDriverLocation(driverId: string, lat: number, lng: number) {
  const location = {
    type: 'Point',
    coordinates: [lng, lat],
  };

  const existing = await DriverCurrentLocation.findOne({ driverId });

  // check if current location (driver, lng, lat) is the same as incoming update
  if (!existing || existing.location.coordinates[0] !== lng || existing.location.coordinates[1] !== lat) {
    // Save to ledger
    await DriverLocationLedger.create({ driverId, location });

    // Upsert current location
    await DriverCurrentLocation.updateOne(
      { driverId },
      {
        $set: {
          location,
          updatedAt: new Date(),
        },
        $inc: { version: 1 },
      },
      { upsert: true }
    );
  }
}

export async function getDriverLocation(driverId: string){
  return DriverCurrentLocation.findOne({ driverId });
}

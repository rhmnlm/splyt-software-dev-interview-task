import { DriverCurrentLocation } from '../models/DriverCurrentLocation';
import { DriverLocationLedger } from '../models/DriverLocationLedger';
import { DriverLocationUpdate } from '../interfaces/DriverLocationUpdate';

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

export async function batchUpdateDriverLocation(driverBatchUpdates: DriverLocationUpdate[]){
  try{

    const latestLocationMap = new Map<string, DriverLocationUpdate>();

    for (const update of driverBatchUpdates) {
      const existing = latestLocationMap.get(update.driver_id);
      if (!existing || update.timestamp > existing.timestamp) {
        latestLocationMap.set(update.driver_id, update);
      }
    }

    const bulkOps = Array.from(latestLocationMap.values()).map(update => ({
      updateOne: {
        filter: { driverId: update.driver_id },
        update: {
          $set: {
            location: { type: "Point", coordinates: [update.longitude, update.latitude]},
            updatedAt: new Date(update.timestamp)
          },
          $inc: { version: 1 }
        },
        upsert: true
      }
    }));

    await DriverCurrentLocation.bulkWrite(bulkOps);
    console.log(`Successfully updated drivers location: `);
    for (const driver of driverBatchUpdates) {
      console.log(`${driver.driver_id}: ${driver.timestamp}`);
    }


    // Massage for ledger insert
    const locationLedger = driverBatchUpdates.map(update => ({
      driverId: update.driver_id,
      location: {
        type: "Point",
        coordinates: [update.longitude, update.latitude],
      },
      timestamp: new Date(update.timestamp),
    }));

    //insert history into ledger
    await DriverLocationLedger.insertMany(locationLedger);
    return `Successfully inserted ${locationLedger.length} records into ledger`;

  }catch(error){
    console.error(`Error during batchUpdateDriverLocation(): `, error);
  }
}

export async function getDriverLocation(driverId: string){
  return DriverCurrentLocation.findOne({ driverId });
}

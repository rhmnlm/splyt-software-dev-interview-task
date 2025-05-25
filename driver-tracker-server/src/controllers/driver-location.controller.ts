import { Request, Response } from 'express';
import * as driverService from '../services/driver-location.services';
import { addToBatch } from '../services/batcher.services';

export async function upsertLocation(req: Request, res: Response) {
  try {
    const { driver_id, latitude, longitude } = req.body;
    if (!driver_id || latitude === undefined || longitude === undefined) {
      res.status(400).json({ message: "Missing required fields" });
    }
    const update = {
      driver_id,
      latitude,
      longitude,
      timestamp: Date.now()
    };
    addToBatch(update);
    res.status(202).json({message:"acknowledged"});
  }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getDriverLocation(req: Request, res: Response) {
  const { driverId } = req.params;
  try {
    const result = await driverService.getDriverLocation(driverId);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: 'Driver not found' });
  }
}

export async function getDriverLocationLedger(req: Request, res: Response){
  try{
    const driverId:string = req.query.driver_id as string;
    const page:number = parseInt(req.query.page as string || '1', 10);

    if (!driverId) {
      res.status(400).json({ message: 'driver_id is required' });
    }

    const locationLedger = await driverService.getDriverLocationLedger( driverId, page );

    res.status(200).json(locationLedger);

  }catch (error){
    console.error('Error fetching driver location history', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
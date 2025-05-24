import { Request, Response } from 'express';
import * as driverService from '../services/driver-location.services';

export async function upsertLocation(req: Request, res: Response) {

    try {
        const { driver_id, latitude, longitude } = req.body;
        const result = await driverService.updateDriverLocation(driver_id, latitude, longitude);
        res.status(200).json(result);
        // res.status(200).json('upsertLocation called');
    } catch (err) {
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
    // res.status(200).json('getDriverLocation called');
  } catch (err) {
    res.status(404).json({ message: 'Driver not found' });
  }
}
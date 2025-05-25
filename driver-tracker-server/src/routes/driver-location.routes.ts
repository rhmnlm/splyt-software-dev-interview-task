import { Router } from 'express';
import * as driverController from '../controllers/driver-location.controller';
import { authToken } from '../middlewares/auth.middleware';

const driverRouter = Router();

// POST /drivers/location
driverRouter.post('/location', authToken, driverController.upsertLocation);

// GET /drivers/:driverId/location
driverRouter.get('/:driverId/location', driverController.getDriverLocation);

//GET /drivers/location/history?driver_id=abc123&page=1
driverRouter.get('/location/history', driverController.getDriverLocationLedger);

export default driverRouter;
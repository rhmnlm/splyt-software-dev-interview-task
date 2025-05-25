import { Router } from 'express';
import * as driverController from '../controllers/driver-location.controller';
// import { authenticate } from '../middleware/auth.middleware';

const driverRouter = Router();

// router.use(authenticate);

// POST /drivers/location
driverRouter.post('/location', driverController.upsertLocation);

// GET /drivers/:driverId/location
driverRouter.get('/:driverId/location', driverController.getDriverLocation);

//GET /drivers/location/history?driver_id=abc123&page=1
driverRouter.get('/location/history', driverController.getDriverLocationLedger);

export default driverRouter;
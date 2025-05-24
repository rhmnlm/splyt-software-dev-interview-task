import { Router } from 'express';
import * as driverController from '../controllers/driver-location.controller';
// import { authenticate } from '../middleware/auth.middleware';

const driverRouter = Router();

// Middleware example — applies to all routes here
// router.use(authenticate);

// POST /drivers/location
driverRouter.post('/location', driverController.upsertLocation);

// GET /drivers/:driverId/location
driverRouter.get('/:driverId/location', driverController.getDriverLocation);

export default driverRouter;
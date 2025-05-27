import { Router } from 'express';
import * as driverController from '../controllers/driver-location.controller';
import { authToken } from '../middlewares/auth.middleware';

const driverRouter = Router();

/**
 * @swagger
 * /drivers/location:
 *   post:
 *     summary: Upload driver's location
 *     description: Upload driver's location. Required fields are `driver_id`, `latitude`, and `longitude`.  
 *       This route is protected with an API token, passed in the `Authorization` header.
 *     tags:
 *       - Drivers
 *     security:
 *       - apiTokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - driver_id
 *               - latitude
 *               - longitude
 *             properties:
 *               driver_id:
 *                 type: string
 *                 description: Unique identifier of the driver
 *                 example: driver_0001
 *               latitude:
 *                 type: number
 *                 format: float
 *                 description: Current latitude of the driver
 *                 example: 14.5995
 *               longitude:
 *                 type: number
 *                 format: float
 *                 description: Current longitude of the driver
 *                 example: 120.9842
 *     responses:
 *       202:
 *         description: Acknowledgement status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: acknowledged
 *       400:
 *         description: Bad request (e.g. missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing required fields
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
// POST /drivers/location
driverRouter.post('/location', authToken, driverController.upsertLocation);

/**
 * @swagger
 * /drivers/{driverId}/location:
 *   get:
 *     summary: Get latest driver location
 *     description: Returns the most recent known location of a driver.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: path
 *         name: driverId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the driver
 *         example: driver_0001
 *     responses:
 *       200:
 *         description: Driver location found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 driverId:
 *                   type: string
 *                   example: driver_0001
 *                 location:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: Point
 *                     coordinates:
 *                       type: array
 *                       items:
 *                         type: number
 *                       example: [120.9842, 14.5995]
 *                 version:
 *                   type: number
 *                   example: 1
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-27T12:34:56.789Z"
 *       404:
 *         description: Driver not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Driver not found
 */
// GET /drivers/:driverId/location
driverRouter.get('/:driverId/location', driverController.getDriverLocation);

/**
 * @swagger
 * /drivers/location/history:
 *   get:
 *     summary: Get driver's location history
 *     description: Returns a paginated list of driver location updates in reverse chronological order.
 *     tags:
 *       - Drivers
 *     parameters:
 *       - in: query
 *         name: driver_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the driver
 *         example: driver_0001
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *     responses:
 *       200:
 *         description: Paginated list of driver locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 4
 *                 totalCount:
 *                   type: integer
 *                   example: 185
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       driverId:
 *                         type: string
 *                         example: driver_0001
 *                       location:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: Point
 *                           coordinates:
 *                             type: array
 *                             items:
 *                               type: number
 *                             example: [120.9842, 14.5995]
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-05-27T12:34:56.789Z"
 *       400:
 *         description: Missing required driver_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: driver_id is required
 *       500:
 *         description: Server error while fetching location history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
//GET /drivers/location/history?driver_id=abc123&page=1
driverRouter.get('/location/history', driverController.getDriverLocationLedger);

export default driverRouter;
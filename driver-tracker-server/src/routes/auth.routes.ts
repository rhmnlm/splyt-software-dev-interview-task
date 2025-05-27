import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { ApiToken } from '../models/ApiToken';
import * as TokenController from "../controllers/api-token.controller";

const authRouter = Router();;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in and receive an API token
 *     description: Authenticates a user and returns an API token for future authenticated requests.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: splyt-admin
 *               password:
 *                 type: string
 *                 example: splyt-admin123
 *     responses:
 *       200:
 *         description: Successful login, returns a token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The JWT token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Unauthorized - invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
authRouter.post('/login', AuthController.login);

/**
 * @swagger
 * /auth/token:
 *   post:
 *     summary: Generate a new API token
 *     description: Generates a new 64-character API token. Requires JWT authentication.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Successfully created a new API token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The newly generated API token
 *                   example: 87c5bd5cb22e4ed9b58fc64b46d65b5f49d9dc3fe2d1f485db4124c4e379fceb
 *       401:
 *         description: Unauthorized - missing or invalid JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error during token generation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
// Create token
authRouter.post('/token', requireAuth, TokenController.createToken);

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: List all API tokens
 *     description: Retrieves a list of all API tokens including their creation date and revocation status. Requires authentication.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of API tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   token:
 *                     type: string
 *                     example: 87c5bd5cb22e4ed9b58fc64b46d65b5f49d9dc3fe2d1f485db4124c4e379fceb
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-28T10:20:30.400Z"
 *                   revoked:
 *                     type: boolean
 *                     example: false
 *       401:
 *         description: Unauthorized - missing or invalid JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
// List tokens
authRouter.get('/token', requireAuth, async (req, res) => {
  const tokens = await ApiToken.find().lean();
  res.json(tokens);
});

/**
 * @swagger
 * /auth/token/{id}:
 *   delete:
 *     summary: Revoke an API token
 *     description: Revoke (disable) the API token specified. Requires authentication.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the API token to revoke
 *         required: true
 *         schema:
 *           type: string
 *           example: 605c72f8bcf86cd799439011
 *     responses:
 *       200:
 *         description: Token successfully revoked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token revoked
 *       400:
 *         description: Invalid token ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token provided
 *       401:
 *         description: Unauthorized - missing or invalid JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */
// Revoke token
authRouter.delete('/token/:id', requireAuth, TokenController.revokeToken);

export default authRouter;
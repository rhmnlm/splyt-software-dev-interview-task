import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { ApiToken } from '../models/ApiToken';
import * as TokenController from "../controllers/api-token.controller";

const authRouter = Router();;

authRouter.post('/login', AuthController.login);

// Create token
authRouter.post('/token', requireAuth, TokenController.createToken);

// List tokens
authRouter.get('/token', requireAuth, async (req, res) => {
  const tokens = await ApiToken.find().lean();
  res.json(tokens);
});

// Revoke token
authRouter.delete('/token/:id', requireAuth, TokenController.revokeToken);

export default authRouter;
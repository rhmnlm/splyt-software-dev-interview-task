import { Request, Response, NextFunction } from 'express';
import * as TokenService from "../services/api-token.services"
import * as JwtService from "../utilities/jwt";

//middleware to auth token from data-feeder
export async function authToken(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;
  
  if (!authToken){
    console.log(`No token passed in header`)
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  const token = await TokenService.findToken(authToken);
  if(token.length === 0){
    console.log(`non-existing token: ${authToken}`)
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  if(token[0].revoked){
    console.log(`${token[0].token} revoked!`)
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  next();
}

//middleware auth to guard token related services
export async function requireAuth(req: Request, res: Response, next: NextFunction){
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization token missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not set in environment');
    }
    JwtService.verifyJWT(token);
    next(); 
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }
}
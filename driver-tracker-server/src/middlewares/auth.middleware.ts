import { Request, Response, NextFunction } from 'express';
import * as TokenService from "../services/api-token.services"

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

export async function requireAuth(req: Request, res: Response, next: NextFunction){
  next();
}
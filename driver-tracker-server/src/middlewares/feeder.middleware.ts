import { Request, Response, NextFunction } from 'express';

//middleware to auth token from data-feeder
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== 'Bearer secret-token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  next();
}
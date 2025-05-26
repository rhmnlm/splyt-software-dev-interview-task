import jwt from "jsonwebtoken";

export function generateJWT(payload: object){

  return jwt.sign(
        payload, 
        process.env.JWT_SECRET,
        {algorithm:'HS256', expiresIn:'1h'}
    );
};

export function verifyJWT(token: string){
  return jwt.verify(token, process.env.JWT_SECRET!);
};
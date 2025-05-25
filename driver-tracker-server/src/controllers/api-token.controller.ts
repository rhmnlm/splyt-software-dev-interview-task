import { Request, Response } from "express";
import * as TokenService from "../services/api-token.services"

export async function createToken(req: Request, res: Response){
  try {
    const createdToken = await TokenService.createToken();
    res.status(201).json({message: createdToken});
  }catch(error){
    console.error("Error creating token", error.message);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export async function revokeToken(req: Request, res: Response){
  const tokenId = req.params.id;
  if(!tokenId) res.status(400).json({message:"Invalid token provided"})
  try {
    await TokenService.revokeToken(tokenId);
    console.log(`revoked token ${tokenId}`)
    res.status(200).json({message:"Token revoked"});
  }catch(error){
    console.error("Error revoking token", error.message);
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
import { Request, Response } from 'express';
import * as UserService from "../services/user.services";

export async function login(req: Request, res: Response){
    const { username, password } = req.body;

    const token = await UserService.login(username, password)
    if(!token){
        res.status(401).json({message:"Unauthorized"})
    }
    else{
        res.status(200).json({message:token})
    }
}
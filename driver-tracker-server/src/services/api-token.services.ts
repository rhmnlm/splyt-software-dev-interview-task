import crypto from "crypto"
import { ApiToken } from "../models/ApiToken";

export async function seedToken(){
    const existing = await ApiToken.findOne({ token: process.env.API_SERVER_TOKEN });
    if (!existing) {
        await ApiToken.create({token: process.env.API_SERVER_TOKEN});
        console.log("generated seed token");
    }else{
        console.log("seed token has already been created");
    }
}

export async function createToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            reject(err);
        }
        const token = buffer.toString('hex');
        await ApiToken.create({token:token});
        resolve(token);
    });
  });
}

export async function revokeToken(token: string){
    await ApiToken.findOneAndUpdate({token: token}, { revoked: true });
}

export async function findToken(passedToken: string){
    const token = await ApiToken.find({token: passedToken}).lean();
    return token;
}
import argon2 from "argon2";
import { User } from "../models/User";
import { generateJWT } from '../utilities/jwt'

export async function seedAdmin(){
    const existing = await User.findOne({username: "splyt-admin"}).lean();
    if(!existing){
        const hash = await hashPassword('splyt-admin123')
        await User.create({username: "splyt-admin", passwordHash: hash});
        console.log('generated seed admin');
    }
}

export async function createUser(username: string, password: string){
    const existing = await User.findOne({username: username}).lean();
    if(!existing){
        const hash = await hashPassword(password)
        await User.create({username: username, passwordHash: hash});
    }
}

export async function login(username: string, password: string){
    const existing = await User.findOne({username: username}).lean();
    if(!existing){
        console.log(`Invalid credential! username ${username} does not exists`)
        return false;
    }
    const passwordVerified = verifyPassword(existing.passwordHash, password)
    if(!passwordVerified){
        console.log(`Invalid credential! username ${username} password does not match`);
        return false
    }
    const token = generateJWT({ username: username});
    return token;  
}

async function hashPassword(plaintext: string){
    const hash = await argon2.hash(plaintext,{
        type: argon2.argon2id,
        memoryCost: 19 * 1024,
        timeCost: 2,
        parallelism:1
    });
    return hash;
}

async function verifyPassword(hashed: string, input: string){
    return await argon2.verify(hashed, input);
}
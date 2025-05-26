import * as TokenService from "../services/api-token.services"
import { seedAdmin } from "../services/user.services";

export async function initDb(){
    try{
        await TokenService.seedToken();
        await seedAdmin();
    }catch(error){
        console.log("unable to seed token", error)
    }
}
import * as TokenService from "../services/api-token.services"

export async function initDb(){
    try{
        await TokenService.seedToken();
    }catch(error){
        console.log("unable to seed token", error)
    }
}
import axios from "axios";
import {routes} from "@/Config";

async function checkToken(token: string): Promise<boolean>{
    return new Promise<boolean>(async resolve => {
        let resp = await axios.post(routes.token, {
            "token": token
        });
        if(resp.status == 200 && resp.data.status == 0)
            resolve(true);
        else
            resolve(false);
    })
}

export {checkToken};
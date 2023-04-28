import axios from "axios";
import {routes} from "@/Config";
import crypto from "crypto";

type APIResponse<T=any> = {
    success: boolean,
    message?: string,
    data?: T
}

namespace API{
    export async function authorize(email: string, password: string): Promise<APIResponse<string|null>>{
        return new Promise<APIResponse>(resolve => {
            axios.post(routes.authorize, {
                "email": email,
                "password": crypto.createHash("sha512").update(password, "utf-8").digest('hex')
            }).then(resp=>{
                if(resp.status == 200 && resp.data.status == 0){
                    resolve({success: true, data: resp.data.data.token});
                }
            }).catch(e=>{
                if(e.response) {
                    if (e.response.status == 400 && e.response.data.status == 1)
                        resolve({success: false, message: "Invalid login or password provided."})
                }
                resolve({success: false, message: "Unknown error."})
            })
        })
    }
}

export default API;
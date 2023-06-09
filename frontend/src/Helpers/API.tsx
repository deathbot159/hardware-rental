import axios from "axios";
import {routes} from "@/Config";
import crypto from "crypto";
import {DeviceState} from "@/Helpers/DeviceState";
import {IRentDevice, ISessionData} from "@/@Types/SessionTypes";
import {IDevice} from "@/@Types/DeviceDataTypes";

type APIResponse<T=any> = {
    success: boolean,
    message?: string,
    data?: T
}

namespace API{
    export async function checkToken(token: string): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.post(routes.token, {
                "token": token
            }).then(()=>{
                resolve({success: true});
            }).catch(e=>{
                resolve({success: false});
            })
        })
    }

    export async function authorize(email: string, password: string): Promise<APIResponse<string|null>>{
        return new Promise<APIResponse>(resolve => {
            axios.post(routes.authorize, {
                "email": email,
                "password": crypto.createHash("sha512").update(password, "utf-8").digest('hex')
            }).then(resp=>{
                resolve({success: true, data: resp.data.data.token});
            }).catch(e=>{
                if(e.response) {
                    if (e.response.status == 400 && e.response.data.status == 1)
                        resolve({success: false, message: "Invalid login or password provided."})
                }else
                    resolve({success: false, message: "Unknown error."})
            })
        })
    }

    export async function getUserInfo(): Promise<APIResponse>{
        return new Promise<APIResponse<ISessionData>>(resolve => {
            axios.get(routes.currentUserInfo, {
                headers: {"x-access-token": localStorage.getItem("token")}
            }).then(resp => {
                if (resp.status == 200) {
                    resolve({success: true, data: resp.data.data});
                }
            }).catch(() => {
                resolve({success: false});
            })
        });
    }

    export async function getDevices(): Promise<APIResponse<IDevice[]>>{
        return new Promise<APIResponse<IDevice[]>>(resolve => {
            axios.get(routes.devices, {
                "headers":{"x-access-token": localStorage.getItem("token")}
            }).then(resp=>{
                let devices = resp.data.data
                resolve({success: true, data: devices});
            }).catch(e=>{
                resolve({success: false});
            })
        });
    }

    export async function getRentDevices(): Promise<APIResponse<IRentDevice[]>>{
        return new Promise<APIResponse<IRentDevice[]>>(resolve => {
            axios.get(routes.rentDevices, {
                "headers": {"x-access-token": localStorage.getItem("token")}
            }).then(resp => {
                resolve({success: true, data: resp.data.data});
            }).catch(e=>{
                resolve({success: false});
            });
        });
    }

    export async function rentDevice(devId: string): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.post(routes.rentDevice(devId), {} ,{
                "headers": {"x-access-token": localStorage.getItem("token")}
            }).then(()=>{
                resolve({success: true});
            }).catch(e=>{
                if(e.response){
                    if(e.response.status == 401){
                        resolve({success: false, message: "Invalid token. Please, log in again."});
                    }else if(e.response.status == 400 && e.response.data.status == 6){
                        resolve({success: false, message: "Try again."});
                    }else if(e.response.status == 400 && e.response.data.status == -1){
                        resolve({success: false, message: "Cannot rent this device."});
                    }
                }else{
                    resolve({success: false, message: "Unknown error."});
                }
            })
        });
    }

    export async function returnDevice(devId: string): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.delete(routes.returnDevice(devId), {
                headers: {"x-access-token": localStorage.getItem("token")}
            }).then(()=>{
                resolve({success: true});
            }).catch(e=>{
                if(e.response){
                    if(e.response.status == 401){
                        resolve({success: false, message: "Invalid token. Please, log in again."});
                    }else if(e.response.status == 400 && e.response.data.status == 6){
                        resolve({success: false, message: "Try again."});
                    }else if(e.response.status == 400 && e.response.data.status == -1){
                        resolve({success: false, message: "Cannot return this device."});
                    }
                }else{
                    resolve({success: false, message: "Unknown error."});
                }
            })
        });
    }

    export async function addDevice({name, company, state}: {name: string, company: string, state: boolean}): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.post(routes.addDevice, {
                "name": name,
                "company": company,
                "disabled": state
            }, {
                "headers": {"x-access-token": localStorage.getItem("token")},
            }).then(() => {
                resolve({success: true});
            }).catch(e => {
                if(e.response) {
                    if (e.response.data.status == 2) {
                        resolve({success: false, message: "Invalid token. Please, log in again."});
                    }
                    else if (e.response.data.status == 4) {
                        resolve({success: false, message: "Invalid permissions."});
                    }
                    else if (e.response.data.status == 6) {
                        resolve({success: false, message: "Try again."});
                    }
                    else if (e.response.data.status == -1) {
                        resolve({success: false, message: e.response.data.message});
                    }
                }else
                    resolve({success: true, message: "Cannot add device. API error."});
            })
        });
    }

    export async function removeDevice(devId: string): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.delete(routes.removeDevice(devId), {
                "headers": {"x-access-token": localStorage.getItem("token")}
            }).then(()=>{
                resolve({success: true});
            }).catch(e=>{
                if(e.response) {
                    if (e.response.data.status == 2) {
                        resolve({success: false, message: "Invalid token. Please, log in again."});
                    }
                    else if (e.response.data.status == 4) {
                        resolve({success: false, message: "Invalid permissions."});
                    }
                    else if (e.response.data.status == 6) {
                        resolve({success: false, message: "Try again."});
                    }
                    else if (e.response.data.status == -1) {
                        resolve({success: false, message: e.response.data.message});
                    }
                }else
                   resolve({success: true, message: "Cannot remove device. API error."});
            })
        });
    }

    export async function editDevice(devId: string, data: {name: string, company: string, state: DeviceState}): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.put(routes.editDevice(devId), {
                "name": data.name,
                "company": data.company,
                "state": data.state
            }, {
                "headers": {"x-access-token": localStorage.getItem("token")},
            }).then(() => {
                resolve({success: true});
            }).catch(e => {
                if (e.response) {
                    if (e.response.data.status == 2) {
                        resolve({success: false, message: "Invalid token. Please, log in again."});
                    }
                    else if (e.response.data.status == 4) {
                        resolve({success: false, message: "Invalid permissions."});
                    }
                    else if (e.response.data.status == 5) {
                        resolve({success: false, message: "Invalid request body."});
                    }
                    else if (e.response.data.status == 6) {
                        resolve({success: false, message: "Try again."});
                    }
                    else if (e.response.data.status == -1) {
                        resolve({success: false, message: e.response.data.message});
                    }
                } else
                    resolve({success: false, message: "Cannot edit device. API error."});
            })
        });
    }

    export async function sendDeviceToRepair(devId: string, state: DeviceState): Promise<APIResponse>{
        return new Promise<APIResponse>(resolve => {
            axios.put(routes.editDevice(devId), {
                "state": state == DeviceState.InRepair? DeviceState._: DeviceState.InRepair
            }, {
                "headers": {"x-access-token": localStorage.getItem("token")}
            }).then(()=>{
                resolve({success: true});
            }).catch(e=>{
                if(e.response) {
                    if (e.response.data.status == 2) {
                        resolve({success: false, message: "Invalid token. Please, log in again."})
                    }
                    else if (e.response.data.status == 4) {
                        resolve({success: false, message: "Invalid permissions."})
                    }
                    else if(e.response.data.status == 5){
                        resolve({success: false, message: "Invalid request body."});
                    }
                    else if (e.response.data.status == 6) {
                        resolve({success: false, message: "Try again."});
                    }
                    else if (e.response.data.status == -1) {
                        resolve({success: false, message: e.response.data.message});
                    }
                }else
                    resolve({success: false, message: "Cannot send device to repair. API error."});
            })
        });
    }
}

export default API;
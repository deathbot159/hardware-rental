import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {DeviceDataType, IDevice} from "@/@Types/DeviceDataTypes";
import {useSession} from "@/Context/SessionProvider";
import {useAlert} from "@/Context/AlertProvider";
import axios from "axios";
import {routes} from "@/Config";
import {useRouter} from "next/router";
import {DeviceState} from "@/Helpers/DeviceState";

export const DeviceDataContext = createContext<DeviceDataType | null>(null);

export default function DeviceDataProvider({children}: {children: ReactNode}){
    const {sessionData} = useSession();
    const {editAlert} = useAlert();
    const [devices, setDevicesState] = useState([] as IDevice[]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const {push} = useRouter();

    useEffect(()=>{
        let token = localStorage.getItem("token");
        if(token == null){
            editAlert(true, "danger", "Nullified token detected. Please log in again.");
        }else{
            axios.get(routes.devices, {
                "headers":{"x-access-token": localStorage.getItem("token")}
            }).then(resp=>{
                if(resp.status == 200){
                    let devices: IDevice[] = resp.data.data;
                    setDevicesState(
                        devices.map(d=>({...d, name: `${d.company} ${d.name}` , availability: !sessionData.isAdmin? d.state != 0? DeviceState.NotAvilable: DeviceState._:d.state}))
                            .sort((a,b)=>(a.name < b.name)?-1:1)
                    );
                }
                setLoadingDevices(false);
            }).catch(e=>{
                localStorage.removeItem("token");
                push("/auth");
            })
        }
    }, [editAlert, push, sessionData]);

    const setDevices = (devices: IDevice[]) => {
        setDevicesState(devices);
    }

    const refreshData = ()=>{

    }

    const rentDevice = (deviceId: string) => {

    }

    const returnDevice = (deviceId: string) => {

    }

    const editDevice = (deviceId: string) => {

    }

    const removeDevice = (deviceId: string) => {

    }

    const sendDeviceToRepair = (deviceId: string) => {

    }

    return (
      <DeviceDataContext.Provider value={
          {
              devices, loadingDevices, setDevices, refreshData, rentDevice, returnDevice,
              adminActions: {editDevice, removeDevice, sendDeviceToRepair}
          }
      }>
          {children}
      </DeviceDataContext.Provider>
    );
}

export const useDeviceData = () => {
    const context = useContext(DeviceDataContext);
    if(!context)
        throw new Error("useDeviceData must be used inside a `DeviceDataProvider`.")
    return context;
}
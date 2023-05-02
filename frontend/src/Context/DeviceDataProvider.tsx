import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {DeviceDataType, IDevice} from "@/@Types/DeviceDataTypes";
import {useSession} from "@/Context/SessionProvider";
import {useRouter} from "next/router";
import {DeviceState} from "@/Helpers/DeviceState";
import API from "@/Helpers/API";

export const DeviceDataContext = createContext<DeviceDataType | null>(null);

export default function DeviceDataProvider({children}: {children: ReactNode}){
    const {sessionData} = useSession();
    const [devices, setDevicesState] = useState([] as IDevice[]);
    const [loadingDevices, setLoadingDevices] = useState(true);
    const {push} = useRouter();

    useEffect(()=> {refreshData()}, [sessionData.fetching]);

    const setDevices = (devices: IDevice[]) => {
        setDevicesState(devices);
    }

    const refreshData = async () => {
        const token = localStorage.getItem("token");
        if(token == null) return;
        const {success, data: devicesData} = await API.getDevices();
        if (!(success && devicesData)) {
            localStorage.removeItem("token");
            push("/auth");
            return;
        }
        const {success: successU, data: userData} = await API.getUserInfo();
        if(!(success && userData)){
            localStorage.removeItem("token");
            push("/auth");
            return;
        }
        setDevicesState(
            devicesData.map(d => ({
                ...d,
                name: `${d.company} ${d.name}`,
                availability: !userData.admin ? d.state != 0 ? DeviceState.NotAvilable : DeviceState._ : d.state
            }))
                .sort((a, b) => (a.name < b.name) ? -1 : 1)
        );
        setLoadingDevices(false);
    }


    return (
      <DeviceDataContext.Provider value={
          {
              devices, loadingDevices, setDevices, refreshData
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
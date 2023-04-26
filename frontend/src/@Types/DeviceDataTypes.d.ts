export interface IDevice {
    id: string,
    name: string,
    company: string,
    date: number,
    state: number
}

export type DeviceDataType = {
    devices: IDevice[],
    setDevices: (devices: IDevice[]) => void;
    loadingDevices: boolean,
    refreshData: () => void;
    rentDevice: (deviceId: string) => void;
    returnDevice: (deviceId: string) => void;
    adminActions: {
        editDevice: (deviceId: string, data: IDevice) => void;
        removeDevice: (deviceId: string) => void;
        sendDeviceToRepair: (deviceId: string) => void;
    }
}
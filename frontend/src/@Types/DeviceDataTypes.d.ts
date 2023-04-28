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
}
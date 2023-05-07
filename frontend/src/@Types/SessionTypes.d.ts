export interface IRentDevice {
    deviceId: string;
    accountId: string;
    date: number;
}

export interface ISessionData {
    avatarLink: string;
    name: string;
    isAdmin: boolean;
    fetching: boolean;
}

export type SessionType = {
    sessionData: ISessionData;
    rentDevices: IRentDevice[];
    loadingRentDevices: boolean;
    refreshRentDevices: () => void;
    setRentDevices: (rentDevices: IRentDevice[]) => void;
    editSession: (sessionData: ISessionData) => void;
}


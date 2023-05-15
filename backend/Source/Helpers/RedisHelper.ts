import * as redis from "redis";
import cfg from "../Config"
import AccountDTO from "../DTOs/AccountDTO";
import DeviceDTO from "../DTOs/DeviceDTO";

namespace RedisHelper {
    async function getClient() {
        try {
            const client = redis.createClient({socket: {host: cfg.cacheServer.host, port: cfg.cacheServer.port}});
            await client.connect()
            return client;
        } catch (e) {
            console.error(e);
            throw Error()
        }
    }

    export async function setAccount(email: string, data: AccountDTO): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            try {
                const client = await getClient();
                client.set(email, JSON.stringify(data)).then(async () => {
                    await client.hSet("id/email", data.id, data.email);
                    resolve(true);
                }).catch(e => {
                    console.error(e);
                    resolve(false);
                })
            } catch (e) {
                console.error(e);
                resolve(false)
            }
        })
    }

    export async function getAccount(email: string): Promise<AccountDTO | {}> {
        return new Promise<AccountDTO | {}>(async resolve => {
            try {
                const client = await getClient();
                client.get(email).then((data) => {
                    resolve(JSON.parse(data as any))
                }).catch(e => {
                    console.error(e);
                    resolve({})
                })
            } catch (e) {
                console.error(e);
                resolve({})
            }
        })
    }

    export async function getAccountById(id: string): Promise<AccountDTO | {}> {
        return new Promise<AccountDTO | {}>(async resolve => {
            try {
                const client = await getClient();
                client.hGet("id/email", id).then(async data => {
                    if (data == undefined) {
                        resolve({});
                    } else {
                        const acc = await client.get(data);
                        if (acc == undefined) resolve({})
                        else resolve(JSON.parse(acc));
                    }
                }).catch(e => {
                    console.error(e);
                    resolve({});
                })
            } catch (e) {
                console.error(e);
                resolve({})
            }
        })
    }

    export async function getDevices(): Promise<DeviceDTO[]> {
        return new Promise<DeviceDTO[]>(async resolve => {
            let devices: DeviceDTO[] = [];
            try {
                const client = await getClient();
                client.hGetAll("devices").then(async data => {
                    resolve(Object.values(data as any).map(v => JSON.parse(v as string)) as DeviceDTO[]);
                }).catch(e => {
                    console.error(e);
                    resolve(devices)
                })
            } catch (e) {
                console.error(e);
                resolve(devices)
            }
        })
    }

    export async function getDevice(deviceId: string): Promise<DeviceDTO | null> {
        return new Promise<DeviceDTO | null>(async resolve => {
            try {
                const client = await getClient();
                client.hGet("devices", deviceId).then(data => {
                    resolve(JSON.parse(data!) as DeviceDTO);
                }).catch(e => {
                    console.error(e);
                    resolve(null);
                })
            } catch (e) {
                console.error(e)
                resolve(null);
            }
        })
    }

    export async function removeDevice(deviceId: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            try {
                const client = await getClient();
                client.hDel("devices", deviceId).then(() => {
                    resolve(true);
                }).catch(e => {
                    console.error(e);
                    resolve(false);
                })
            } catch (e) {
                console.error(e);
                resolve(false);
            }
        });
    }

    export async function setDevices(devices: DeviceDTO[]): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            try {
                const client = await getClient();
                const data = devices.map(v => [v.id, JSON.stringify(v)]).flat();
                client.hSet("devices", data).then(() => {
                    resolve(true);
                }).catch(e => {
                    console.error(e);
                    resolve(false);
                })
            } catch (e) {
                console.error(e);
                resolve(false);
            }
        })
    }

    export async function addDevice(device: DeviceDTO): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            try {
                const client = await getClient();
                client.hSet("devices", [device.id, JSON.stringify(device)]).then(() => {
                    resolve(true);
                }).catch(e => {
                    console.error(e);
                    resolve(false);
                })
            } catch (e) {
                console.error(e);
                resolve(false);
            }
        })
    }
}

export default RedisHelper;
import DeviceDTO from "../../../DTOs/DeviceDTO";
import DatabaseHelper from "../../../Helpers/DatabaseHelper";
import {database} from "../../../Config.json"
import RedisHelper from "../../../Helpers/RedisHelper";
import {v4} from "uuid";
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";
import RentDevices from "../Routes/RentDevices";
import {DeviceState} from "../../../Helpers/DeviceState";

namespace DeviceService {
    import getConnection = DatabaseHelper.getConnection;

    export async function getDevices(): Promise<[DeviceDTO[], boolean]> {
        return new Promise<[DeviceDTO[], boolean]>(async resolve => {
            let fromCache = false;
            try {
                let devices = await RedisHelper.getDevices();
                if(devices.length == 0) {
                    let client = await getConnection();
                    let collection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                    let result = await collection.find();
                    devices = await result.toArray();
                    await client.close();
                    await RedisHelper.setDevices(devices);
                }else fromCache = true;
                resolve([devices, fromCache]);
            } catch (e) {
                console.log(e);
                resolve([[], false])
            }
        });
    }

    export async function getDevice(deviceId: string): Promise<[DeviceDTO|null, boolean]> {
        return new Promise<[DeviceDTO|null, boolean]>(async resolve => {
            let fromCache = false;
            let data: DeviceDTO | null = null;
            try {
                data = await RedisHelper.getDevice(deviceId);
                if (data == null) {
                    let client = await getConnection();
                    let collection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                    data = await collection.findOne({id: deviceId});
                    await client.close();
                    if(data != null) await RedisHelper.addDevice(data);
                } else fromCache = true;
                resolve([data, fromCache]);
            } catch (e) {
                console.log(e);
                resolve([null, false])
            }
        });
    }

    export async function isDeviceRent(deviceId: string): Promise<boolean>{
        return new Promise<boolean>(async resolve => {
            try {
                let client = await getConnection();
                let collection = client.db(database.name).collection<RentDeviceDTO>(database.collections.RentDevicesCollection);
                let data = await collection.findOne({deviceId: deviceId});
                await client.close()
                resolve(data!=null);
            } catch (e) {
                console.error(e);
                resolve(false);
            }
        })
    }

    export async function rentDevice(deviceId: string, accountId: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            try {
                let client = await getConnection();
                let collection = client.db(database.name).collection<RentDeviceDTO>(database.collections.RentDevicesCollection);
                let res = await collection.insertOne({deviceId: deviceId, accountId: accountId, date: new Date().getTime()})
                let deviceCollection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                let updateRes = await deviceCollection.updateOne({id: deviceId}, {$set: {state: DeviceState.Rent}})
                await client.close()
                resolve(true)
            } catch (e) {
                console.error(e);
                resolve(false)
            }
        })
    }

    export async function addDevice(device: {name: string, company: string, state: number}): Promise<boolean> {
        return new Promise<boolean>(async resolve=>{
            try{
                let client = await getConnection();
                let collection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                let data: DeviceDTO = {...device, date: new Date().getTime(), id: v4()}
                let res = await collection.insertOne(data);
                await client.close();
                await RedisHelper.addDevice(data);
                resolve(true);
            }catch(e){
                console.error(e);
                resolve(false);
            }
        })
    }
}

export default DeviceService;
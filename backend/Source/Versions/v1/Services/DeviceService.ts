import DeviceDTO from "../../../DTOs/DeviceDTO";
import DatabaseHelper from "../../../Helpers/DatabaseHelper";
import {database} from "../../../Config.json"
import RedisHelper from "../../../Helpers/RedisHelper";
import {v4} from "uuid";
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";
import RentDevices from "../Routes/RentDevices";
import {DeviceState} from "../../../Helpers/DeviceState";
import devices from "../Routes/Devices";

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
            let session = null;
            try {
                let client = await getConnection();
                session = client.startSession();
                session.startTransaction();
                let collection = client.db(database.name).collection<RentDeviceDTO>(database.collections.RentDevicesCollection);
                let insertResult = await collection.insertOne({deviceId: deviceId, accountId: accountId, date: new Date().getTime()}, {session})
                let deviceCollection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                let updateResult = await deviceCollection.updateOne({id: deviceId}, {$set: {state: DeviceState.Rent}}, {session})
                await session.commitTransaction();
                await client.close()
                resolve(true)
            } catch (e) {
                console.error(e);
                if(session) await session.abortTransaction();
                resolve(false)
            }finally {
                if(session) await session!.endSession()
            }
        })
    }
    export async function returnDevice(deviceId: string, accountId: string): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            let session = null;
            try {
                let client = await getConnection();
                session = client.startSession();
                session.startTransaction();
                let collection = client.db(database.name).collection<RentDeviceDTO>(database.collections.RentDevicesCollection);
                let deleteResult = await collection.deleteOne({deviceId: deviceId, accountId: accountId}, {session})
                let deviceCollection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                let updateResult = await deviceCollection.updateOne({id: deviceId}, {$set: {state: DeviceState._}}, {session})
                await session.commitTransaction();
                await client.close()
                resolve(true)
            } catch (e) {
                console.error(e);
                if(session) await session.abortTransaction();
                resolve(false)
            }finally {
                if(session) await session!.endSession()
            }
        })
    }

    export async function removeDevice(deviceId: string): Promise<boolean>{
        return new Promise<boolean>(async resolve=>{
            try{
                let success = false;

                let client = await getConnection();
                let deviceCollection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                let rentDevicesCollection = client.db(database.name).collection<RentDeviceDTO>(database.collections.RentDevicesCollection);
                let exists = await deviceCollection.findOne({id: deviceId});
                let isRented = !!(await rentDevicesCollection.findOne({deviceId: deviceId}));
                if(exists && !isRented) {
                    if(await RedisHelper.removeDevice(deviceId)) {
                        let deleteResult = await deviceCollection.deleteOne({id: deviceId});
                        success = true;
                    }else{
                        success = false;
                    }
                }
                await client.close();
                resolve(success);
            }catch(e){
                console.error(e);
                resolve(false);
            }
        });
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
    export async function editDevice(device: {id: string, name: string, company: string, state: number}): Promise<boolean>{
        return new Promise<boolean>(async resolve=>{
            let success = false;
            try{
                let client = await getConnection();
                let collection = client.db(database.name).collection<DeviceDTO>(database.collections.DevicesCollection);
                let deviceData = await collection.findOne({id: device.id});
                if(deviceData) {
                    let {id: _, ...data} = {...device, date: new Date().getTime()};
                    let updateResult = await collection.updateOne({id: device.id}, {$set: {...data}});
                    await RedisHelper.addDevice({...deviceData, ...data});
                    success = true;
                }else success = false;
                await client.close();
                resolve(success);
            }catch(e){
                console.error(e);
                resolve(false);
            }
        })
    }
}

export default DeviceService;
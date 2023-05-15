import AccountDTO from "../../../DTOs/AccountDTO";
import cfg from "../../../Config"
import {DatabaseResponse, DatabaseResponseStatus} from "../../../Helpers/DatabaseResponse";
import RedisHelper from "../../../Helpers/RedisHelper";
import DatabaseHelper from "../../../Helpers/DatabaseHelper";
import RentDeviceDTO from "../../../DTOs/RentDeviceDTO";


namespace AccountService {
    import getConnection = DatabaseHelper.getConnection;

    export async function CheckAccount(email: string, password: string): Promise<DatabaseResponse<any>> {
        return new Promise<DatabaseResponse<any>>(async resolve => {
            try {
                let found = false;
                let fromCache = false;
                const cacheData = await RedisHelper.getAccount(email);

                if (cacheData != undefined) {
                    if ((cacheData as AccountDTO).password == password) {
                        found = true;
                        fromCache = true;
                    }
                } else {
                    const client = await getConnection();
                    const collection = client.db(cfg.database.name).collection<AccountDTO>(cfg.database.collections.AccountsCollection);
                    const result = await collection.findOne({email: email, password: password})
                    await client.close()
                    found = !!result;
                }
                resolve({
                    status: !found ? DatabaseResponseStatus.NO_RESULTS : DatabaseResponseStatus.SUCCESS,
                    fromCache: fromCache
                });
            } catch (e) {
                console.log(e);
                resolve({status: DatabaseResponseStatus.DB_ERROR})
            }
        })
    }

    export async function GetAccount(email: string, password: string): Promise<DatabaseResponse<Omit<AccountDTO, "password"> | any>> {
        return new Promise<DatabaseResponse<Omit<AccountDTO, "password"> | any>>(async resolve => {
            try {
                let found = false;
                let fromCache = false;
                let data = {};
                const cacheData = await RedisHelper.getAccount(email);

                if (cacheData != undefined) {
                    if ((cacheData as AccountDTO).password == password) {
                        found = true;
                        fromCache = true;
                        data = cacheData as AccountDTO;
                    }
                } else {
                    const client = await getConnection();
                    const collection = client.db(cfg.database.name).collection<AccountDTO>(cfg.database.collections.AccountsCollection);
                    const result = await collection.findOne({email: email, password: password}, {showRecordId: false})
                    await client.close()
                    if (result) {
                        found = true;
                        data = result;
                    }
                }
                resolve({
                    status: !found ? DatabaseResponseStatus.NO_RESULTS : DatabaseResponseStatus.SUCCESS,
                    fromCache: fromCache,
                    data: data
                });
            } catch (e) {
                resolve({status: DatabaseResponseStatus.DB_ERROR})
            }
        })
    }

    export async function GetAccountById(userId: string): Promise<DatabaseResponse<Omit<AccountDTO, "password"> | any>> {
        return new Promise<DatabaseResponse<Omit<AccountDTO, "password"> | any>>(async resolve => {
            try {
                let found = false;
                let data: {} | AccountDTO = await RedisHelper.getAccountById(userId);
                let fromCache = false;
                if (data) fromCache = true;
                else data = await DatabaseHelper.getAccountById(userId);
                if (data) found = true;
                resolve({
                    status: !found ? DatabaseResponseStatus.NO_RESULTS : DatabaseResponseStatus.SUCCESS,
                    fromCache: fromCache,
                    data: data
                })
            } catch (e) {
                resolve({status: DatabaseResponseStatus.DB_ERROR})
            }
        });
    }

    export async function getRentDevices(userId: string): Promise<RentDeviceDTO[]> {
        return new Promise<RentDeviceDTO[]>(async resolve => {
            try {
                const client = await getConnection();
                const collection = client.db(cfg.database.name).collection<RentDeviceDTO>(cfg.database.collections.RentDevicesCollection);
                const data = await collection.find({accountId: userId}).toArray();
                await client.close();
                resolve(data.length != 0 ? data : [])
            } catch (e) {
                console.error(e);
                resolve([]);
            }
        })
    }

    export async function getRentDeviceById(userId: string, devId: string): Promise<RentDeviceDTO | null> {
        return new Promise<RentDeviceDTO | null>(async resolve => {
            try {
                const client = await getConnection();
                const collection = client.db(cfg.database.name).collection<RentDeviceDTO>(cfg.database.collections.RentDevicesCollection);
                const data = await collection.findOne({accountId: userId, deviceId: devId});
                await client.close();
                resolve(data)
            } catch (e) {
                console.error(e);
                resolve(null)
            }
        })
    }
}

export default AccountService
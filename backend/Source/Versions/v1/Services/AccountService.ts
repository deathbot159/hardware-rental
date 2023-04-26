import AccountDTO from "../../../DTOs/AccountDTO";
import {database} from "../../../Config.json"
import {DatabaseResponse, DatabaseResponseStatus} from "../../../Helpers/DatabaseResponse";
import RedisHelper from "../../../Helpers/RedisHelper";
import DatabaseHelper from "../../../Helpers/DatabaseHelper";


namespace AccountService {
    import getConnection = DatabaseHelper.getConnection;

    export async function CheckAccount(email: string, password: string): Promise<DatabaseResponse<any>> {
        return new Promise<DatabaseResponse<any>>(async resolve => {
            try {
                let found = false;
                let fromCache = false;
                let cacheData = await RedisHelper.getAccount(email);

                if (cacheData != undefined) {
                    if ((cacheData as AccountDTO).password == password) {
                        found = true;
                        fromCache = true;
                    }
                } else {
                    let client = await getConnection();
                    let collection = client.db(database.name).collection<AccountDTO>(database.collections.AccountsCollection);
                    let result = await collection.findOne({email: email, password: password})
                    await client.close()
                    found = result != null;
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
                let cacheData = await RedisHelper.getAccount(email);

                if (cacheData != undefined) {
                    if ((cacheData as AccountDTO).password == password) {
                        found = true;
                        fromCache = true;
                        data = cacheData as AccountDTO;
                    }
                } else {
                    let client = await getConnection();
                    let collection = client.db(database.name).collection<AccountDTO>(database.collections.AccountsCollection);
                    let result = await collection.findOne({email: email, password: password}, {showRecordId: false})
                    await client.close()
                    if (result != null) {
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

    export async function GetAccountById(userId: string): Promise<DatabaseResponse<Omit<AccountDTO, "password"> | any>>{
        return new Promise<DatabaseResponse<Omit<AccountDTO, "password"> | any>>(async resolve => {
           try{
               let found = false;
               let data: any = {};
               let fromCache = false;
               let accountData: any = await RedisHelper.getAccountById(userId);
               if (accountData.id != undefined) {
                   fromCache = true;
                   data = accountData
               } else {
                   data = await DatabaseHelper.getAccountById(userId);
               }
               if(data.id != undefined) found = true;
               resolve({
                   status: !found? DatabaseResponseStatus.NO_RESULTS: DatabaseResponseStatus.SUCCESS,
                   fromCache: fromCache,
                   data: data
               })
           } catch (e) {
               resolve({status: DatabaseResponseStatus.DB_ERROR})
           }
        });
    }
}

export default AccountService
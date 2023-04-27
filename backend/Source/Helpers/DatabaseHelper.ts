import {MongoClient} from "mongodb";
import {database} from "../Config.json"
import AccountDTO from "../DTOs/AccountDTO";

namespace DatabaseHelper {
    export function getConnection() {
        return MongoClient.connect(`mongodb://${database.host}:${database.port}/${database.name}`, {
            auth: {
                username: database.user,
                password: database.password
            },
            directConnection: true
        });
    }

    export async function getAccountById(id: string): Promise<AccountDTO | {}> {
        return new Promise<AccountDTO | {}>(async resolve => {
            try {
                let client = await getConnection();
                let collection = client.db(database.name).collection<AccountDTO>(database.collections.AccountsCollection);
                let result = await collection.findOne({id: id});
                await client.close();
                resolve(result ? result : {});
            } catch (e) {
                console.error(e);
                resolve({});
            }
        });
    }
}

export default DatabaseHelper;

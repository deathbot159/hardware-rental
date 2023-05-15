import {MongoClient} from "mongodb";
import cfg from "../Config"
import AccountDTO from "../DTOs/AccountDTO";

namespace DatabaseHelper {
    export function getConnection() {
        return MongoClient.connect(`mongodb://${cfg.database.host}:${cfg.database.port}/${cfg.database.name}`, {
            directConnection: true
        });
    }

    export async function getAccountById(id: string): Promise<AccountDTO | {}> {
        return new Promise<AccountDTO | {}>(async resolve => {
            try {
                const client = await getConnection();
                const collection = client.db(cfg.database.name).collection<AccountDTO>(cfg.database.collections.AccountsCollection);
                const result = await collection.findOne({id: id});
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

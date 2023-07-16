import { MongoClient, Database } from "$mongo"
import * as config from "./config.ts";

const client: MongoClient = new MongoClient();

let _db: Database;

export async function connect(){
    if (!config.MONGO_URL) throw new Error("MONGO_URL not set!");

    await client.connect(config.MONGO_URL);
    console.log("Connected to Mongo..");

    _db = client.database(config.DB_NAME);
    
    return _db;
}

export const db = () => _db;

await connect();
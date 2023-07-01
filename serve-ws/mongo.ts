import { MongoClient, Database } from "https://deno.land/x/mongo/mod.ts"
import * as config from "./config.ts";

const client: MongoClient = new MongoClient();

let _db: Database;

export async function connect(){
    console.log("Attempting connect to mongo: ", config.MONGO_URL);
    await client.connect(config.MONGO_URL);
    console.log("Connected to Mongo..");

    _db = client.database(config.DB_NAME);
    
    return _db;
}

export const db = () => _db;

await connect();
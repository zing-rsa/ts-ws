import { Collection } from "https://deno.land/x/mongo/mod.ts";

import { WsData, WsTextValue, SocketMessageType } from "models/ws.ts";
import { clients } from '../states/clientState.ts'
import { Message } from "models/ws.ts";
import { db } from "mongo";

const mongo = db();
const messages: Collection<Message> = mongo.collection('messages');

export async function handleMessage(m: MessageEvent, username: string) {

    const data: WsData = JSON.parse(m.data);
    
    if (data.type == SocketMessageType.Text){
        console.log('Received text message: ', m.data);
        
        const message: WsTextValue = {
            text: data.value.text,
            timestamp: Date.now(),
            username,
        }
        
        await messages.insertOne(message);

        data.value = message;
    }

    clients.value.forEach((c) => c.connection.send(JSON.stringify(data)));
}

export async function handleOpen () {

}

export async function handleClose () {

}

export async function handleError () {

}




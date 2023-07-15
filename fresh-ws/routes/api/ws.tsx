import { Collection } from "https://deno.land/x/mongo/mod.ts";
import { Handlers } from "$fresh/server.ts";
import { signal } from "@preact/signals-core"

import { WsData, WsTextValue, SocketMessageType } from "models/ws.ts";
import { Message, Client } from "models/ws.ts";
import { Session } from "models/db.ts";
import { State } from "models/mw.ts";
import { db } from "mongo";

const mongo = db();
const messages: Collection<Message> = mongo.collection('messages');
const sessions: Collection<Session> = mongo.collection('sessions');

export const clients = signal<Client[]>([]);

export const handler: Handlers<any, State> = {
    async GET(req, ctx){
        
        if (req.headers.get('upgrade') != "websocket") {
            return new Response(null, { status : 501 });
        }

        const session = await sessions.findOne({ sessionId: ctx.state.cookies['sessionId'] })
        
        if(!session){
            return Response.json({ message : "No session found" }, { status : 400 });
        }
    
        const { socket: ws, response } = Deno.upgradeWebSocket(req);
    
        ws.onopen = (ev: Event) => handleOpen(ev, ws, session);
    
        ws.onclose = (ev: CloseEvent) => handleClose(ev, session);
    
        ws.onmessage = (ev: MessageEvent) => handleMessage(ev, session);
        
        ws.onerror = (ev: ErrorEvent | Event) => handleError(ev, ws, session);
        
        return response;
    }
}

async function handleMessage(e: MessageEvent, session: Session) {

    const data: WsData = JSON.parse(e.data);
    
    if (data.type == SocketMessageType.Text){
        
        const message: WsTextValue = {
            text: data.value.text,
            timestamp: Date.now(),
            session,
        }
        
        await messages.insertOne(message);

        data.value = message;
    }

    clients.value.forEach((c) => c.connection.send(JSON.stringify(data)));
}

async function handleOpen(e: Event, ws: WebSocket, session: Session){
    console.log("Starting session: ", session.sessionId); 

    clients.value.push({
        session: session,
        connection: ws
    });
}

async function handleClose(e: CloseEvent, session: Session) {
    console.log("Closing session: ", session.sessionId);
    
    await sessions.deleteOne({ sessionId: session.sessionId });

    const clientIdx = clients.value.findIndex((c) => c.session.sessionId == session.sessionId);

    if (clientIdx >= 0) {
        clients.value.splice(clientIdx, 1);
    }
}

async function handleError(e: Event, ws: WebSocket, session: Session){
    console.log("Session errored: ", session.sessionId); 
    if (ws.OPEN) ws.close();

    await sessions.deleteOne({ sessionId: session.sessionId });

    const clientIdx = clients.value.findIndex((c) => c.session.sessionId == session.sessionId);

    if (clientIdx >= 0) {
        clients.value.splice(clientIdx, 1);
    }
}

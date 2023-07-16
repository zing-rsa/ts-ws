import { signal } from "@preact/signals-core"
import { Handlers } from "$fresh/server.ts";
import { Collection } from "$mongo";

import { WsData, WsTextValue, SocketMessageType } from "models/ws.ts";
import { Message, Client } from "models/ws.ts";
import { Session } from "models/db.ts";
import { State } from "models/mw.ts";
import { db } from "mongo";

const mongo = db();
const messages: Collection<Message> = mongo.collection('messages');
const sessions: Collection<Session> = mongo.collection('sessions');

const clients = signal<Client[]>([]);
const typing = signal<boolean>(false);
let typingTimeout = 0;

// deno-lint-ignore no-explicit-any
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
        if (typing.value) {
            handleTypeEnd(session);
        }
        
        const message: WsTextValue = {
            text: data.value.text,
            timestamp: Date.now(),
            session,
        }
        
        await messages.insertOne(message);

        data.value = message;

        
        clients.value.forEach((c) => c.connection.send(JSON.stringify(data)));
    }

    if (data.type == SocketMessageType.UserAction){
        if (data.value.typing) {
            typing.value = true;
            clients.value.forEach((c) => {
                if(c.session.sessionId != session.sessionId){
                    c.connection.send(JSON.stringify(data))
                }
            });

            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => handleTypeEnd(session), 2000);
        }
    }
}

function handleOpen(_e: Event, ws: WebSocket, session: Session){
    console.log("Starting session: ", session.sessionId); 

    clients.value.push({
        session: session,
        connection: ws
    });

    clients.value.forEach((c) => {
        if (c.session.sessionId != session.sessionId){
            c.connection.send(JSON.stringify({
                type: SocketMessageType.AccountState,
                value: {
                    online: true,
                    session: session
                }
            }))
        }
    });
}

function handleClose(_e: CloseEvent, session: Session) {
    console.log("Closing session: ", session.sessionId);

    const clientIdx = clients.value.findIndex((c) => c.session.sessionId == session.sessionId);

    if (clientIdx >= 0) {
        clients.value.splice(clientIdx, 1);
    }

    clients.value.forEach((c) => {
        c.connection.send(JSON.stringify({
            type: SocketMessageType.AccountState,
            value: {
                online:false,
                session: session
            }
        })); 
    })
}

function handleError(_e: Event, ws: WebSocket, session: Session){
    console.log("Session errored: ", session.sessionId); 
    if (ws.OPEN) ws.close();

    const clientIdx = clients.value.findIndex((c) => c.session.sessionId == session.sessionId);

    if (clientIdx >= 0) {
        clients.value.splice(clientIdx, 1);
    }
}

function handleTypeEnd(session: Session) {
    typing.value = false;

    clients.value.forEach((c) => c.connection.send(JSON.stringify({
        type: SocketMessageType.UserAction,
        value: {
            typing: false,
            session: session
        }
    })));
}
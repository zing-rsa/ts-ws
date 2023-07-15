import { Collection } from "https://deno.land/x/mongo/mod.ts";
import { Handlers } from "$fresh/server.ts";

import { WsData, WsTextValue, SocketMessageType } from "models/ws.ts";
import { clients } from "../../states/clientState.ts";
import { Message } from "models/ws.ts";
import { Session } from "models/db.ts";
import { State } from "models/mw.ts";
import { db } from "mongo";

const mongo = db();
const messages: Collection<Message> = mongo.collection('messages');
const sessions: Collection<Session> = mongo.collection('sessions');

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
    
        ws.onopen = () => { 
            console.log("New ws connection..") 
            clients.value.push({
                session: session,
                connection: ws
            });
        };
    
        ws.onclose = async () => { 
            console.log("Closed ws connection..")
    
            const clientIdx = clients.value.findIndex((c) => c.session.sessionId == session.sessionId);
    
            if (clientIdx >= 0) {
                clients.value.splice(clientIdx, 1);
            }
            await sessions.deleteOne({ sessionId: session.sessionId })
        };
    
        ws.onmessage = (ev: MessageEvent) => handleMessage(ev, session);
        
        ws.onerror = (e) => {
            console.error(e)
        } 
        
        return response;
    }
}

export async function handleMessage(m: MessageEvent, session: Session) {

    const data: WsData = JSON.parse(m.data);
    
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
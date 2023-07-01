import { Collection } from "https://deno.land/x/mongo/mod.ts";
import { Client, Message, WsData, SocketMessageType} from "./models.ts";
import { db } from "./mongo.ts";

const clients: Client[] = [];

const mongo = db();
const messages: Collection<Message> = mongo.collection<Message>("messages");

async function handleMessage(m: MessageEvent, username: string) {
    console.log("Received message: ", m.data);

    const data: WsData = JSON.parse(m.data);

    if (data.type == SocketMessageType.Text){
        
        const message = {
            text: data.value,
            timestamp: Date.now(),
            username,
        }
        
        await messages.insertOne(message);
    
        clients.forEach((c) => c.connection.send(JSON.stringify(message)));
    }
}

export async function handleWS(req: Request) {
    const queryParams = new URL(req.url).searchParams;
    const username = queryParams.get('username');

    if (req.headers.get('upgrade') != "websocket") {
        return new Response(null, { status : 501 });
    }
    
    if(!username){
        return Response.json({ message : "Missing username" }, { status : 400 });
    }

    const { socket: ws, response } = Deno.upgradeWebSocket(req);

    ws.onopen = () => { 
        console.log("New ws connection..") 
        clients.push({
            username: username,
            connection: ws
        });
    };

    ws.onclose = () => { 
        console.log("Closed ws connection..")

        const clientIdx = clients.findIndex((c) => c.username = username);
        if (clientIdx) {
            clients.splice(clientIdx, 1);
        }
    };

    ws.onmessage = (ev: MessageEvent) => handleMessage(ev, username);
    
    ws.onerror = (e) => {
        console.error(e)
    } 
    
    return response;

}

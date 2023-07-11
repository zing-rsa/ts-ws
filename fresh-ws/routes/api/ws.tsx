import { Handlers } from "$fresh/server.ts";

import { handleMessage, handleOpen, handleClose, handleError  } from "ws/api.ts";
import { clients } from "../../states/clientState.ts";

export const handler: Handlers = {
    GET(req, ctx){
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
            clients.value.push({
                username: username,
                connection: ws
            });
        };
    
        ws.onclose = () => { 
            console.log("Closed ws connection..")
    
            const clientIdx = clients.value.findIndex((c) => c.username == username);
    
            if (clientIdx >= 0) {
                clients.value.splice(clientIdx, 1);
            }
        };
    
        ws.onmessage = (ev: MessageEvent) => handleMessage(ev, username);
        
        ws.onerror = (e) => {
            console.error(e)
        } 
        
        return response;
    }
}
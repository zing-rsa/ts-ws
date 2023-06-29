import { serve } from "https://deno.land/std/http/mod.ts"

async function reqHandler(req: Request) {
    if (req.headers.get('upgrade') != "websocket") {
        return new Response(null, { status : 501 });
    }

    const { socket: ws, response } = Deno.upgradeWebSocket(req);

    ws.onopen = () => { console.log("New ws connection..") };
    ws.onclose = () => { console.log("Closed ws connection..") };
    ws.onmessage = (m) => {
        console.log("Receveid: ", m.data);
        ws.send('hello');
    }
    ws.onerror = (e) => {
        console.error(e)
    } 
    
    return response;

}

serve(reqHandler, {port: 5000 });
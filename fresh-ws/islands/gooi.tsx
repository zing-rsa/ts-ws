import { useCallback, useEffect } from "https://esm.sh/preact@10.15.1/hooks";
import { useSignal } from "https://esm.sh/*@preact/signals@1.1.3";
import { Button } from "../components/Button.tsx"
import { SocketMessageType, WsData } from "../models.ts";

export default function Gooi() {

    // const ws = useSignal(new WebSocket("ws://localhost:5000?username=zing"));

    const ws = useSignal<WebSocket | null>(null);

    const count = useSignal(0);

    const gooi = useCallback((text: string) => {
        if (ws.value) {

            const data: WsData = {
                type: SocketMessageType.Text, 
                value: {
                    username: "zing",
                    text: text 
                }
            }

            ws.value.send(JSON.stringify(data));

            count.value++;
        }
    }, [ws]);

    useEffect(() => {
        ws.value = new WebSocket("ws://localhost:5000?username=zing");
        
        ws.value.onopen    = ()  => { console.log('Connected..') }
        ws.value.onmessage = (m) => { console.log(m.data) }
        
    }, []);

    return (
        <div>
            <div>{count}</div>
            <Button onClick={() => gooi('test')}>Gooi</Button>
        </div>
    )
}
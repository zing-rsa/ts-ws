import { useCallback, useEffect } from "https://esm.sh/preact@10.15.1/hooks";
import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx"
import { SocketMessageType, WsData } from "../models.ts";

type GooiProps = { username: string | undefined }

export default function Gooi(props: GooiProps) {

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
        if (props.username) {
            console.log("Connecting using: ", "ws://localhost:5000?username=" + props.username);

            ws.value = new WebSocket("ws://localhost:5000?username=" + props.username);
            ws.value.onopen    = ()  => { console.log('Connected..') }
            ws.value.onmessage = (m) => { console.log(m.data) }
        }
    }, []);

    return (
        <div>
            <div>{count}</div>
            <Button onClick={() => gooi('test')}>Gooi</Button>
        </div>
    )
}
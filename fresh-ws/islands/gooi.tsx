import { useCallback, useEffect } from "https://esm.sh/preact@10.15.1/hooks";
import { useSignal } from "@preact/signals";
import { Button } from "../components/Button.tsx"
import { Message, SocketMessageType, WsData } from "../models.ts";
import { MessageList } from "../components/MessageList.tsx";
import { MessageItem } from "../components/MessageItem.tsx";

type GooiProps = { username: string | undefined }


export default function Gooi(props: GooiProps) {

    const ws = useSignal<WebSocket | null>(null);
    const messageList = useSignal<Message[]>([]);

    const count = useSignal(0);

    const updateMessages = useCallback((m: MessageEvent<string>) => {

        const data: WsData = JSON.parse(m.data);
    
        if (data.type == SocketMessageType.Text){

            const message: Message = data.value;

            messageList.value = [...messageList.value, message];
            console.log(messageList.value);
        }
    }, []);

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
            ws.value.onmessage = updateMessages;
        }
    }, []);

    return (
        <div>
            <div>{count}</div>
            
            <Button onClick={() => gooi('test')}>Gooi</Button>

            <div>
                {messageList.value.map((m) => <MessageItem message={m} /> )}
            </div>
        </div>
    )
}
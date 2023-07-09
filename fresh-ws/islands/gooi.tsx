import { useCallback, useEffect } from "https://esm.sh/preact@10.15.1/hooks";
import { useSignal } from "@preact/signals";

import { Message, SocketMessageType, WsData } from "../models.ts";
import { MessageList } from "../components/MessageList.tsx";
import { MessageItem } from "../components/MessageItem.tsx";
import { PrimaryButton } from "../components/PrimaryButton.tsx"

type GooiProps = { username: string | undefined }


export default function Gooi(props: GooiProps) {

    const ws = useSignal<WebSocket | null>(null);
    const messageList = useSignal<Message[]>([]);
    const draft = useSignal<string>('');

    const count = useSignal(0);

    const updateMessages = useCallback((m: MessageEvent<string>) => {

        const data: WsData = JSON.parse(m.data);
    
        if (data.type == SocketMessageType.Text){

            const message: Message = data.value;

            messageList.value = [...messageList.value, message];
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

    const update = useCallback((e) => {
        draft.value = e.target.value;
    }, []);

    return (
        <>
            <MessageList messages={messageList.value} />
            <div class="h-12 flex flex-row justify-center">
                <input type="text" value={draft} onInput={update} class="h-10 w-9/12 my-1 px-2 rounded-md shadow-md focus:outline-none"  />
                <PrimaryButton onClick={() => gooi(draft.value)} class="h-10 my-1 mx-2">Gooi</PrimaryButton>
            </div>
        </>
    )
}
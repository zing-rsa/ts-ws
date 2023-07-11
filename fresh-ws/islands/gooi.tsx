import { useCallback, useEffect } from "https://esm.sh/preact@10.15.1/hooks";
import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";

import { Message, SocketMessageType, WsData } from "models/ws.ts";
import { PrimaryButton } from "../components/PrimaryButton.tsx"
import { MessageItem } from "components/MessageItem.tsx";

interface GooiProps { 
    username: string | undefined,
    url: string,
    messages: Message[]
}

export default function Gooi(props: GooiProps) {

    const ws = useSignal<WebSocket | null>(null);
    const messageList = useSignal<Message[]>(props.messages);
    const draft = useSignal<string>('');
    const chatWindowRef = useRef<HTMLDivElement>(null);

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
        }
    }, [ws]);

    useEffect(() => {
        if (props.username) {

            const wsUrl = "ws://" + props.url + "/api/ws?username=" + props.username;
            console.log("Connect using: ", wsUrl);

            ws.value = new WebSocket(wsUrl);
            ws.value.onopen    = ()  => { console.log('Connected..') }
            ws.value.onmessage = updateMessages;
        }
    }, []);

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: "smooth"});
        }
    }, [chatWindowRef.current?.scrollHeight])

    const update = useCallback((e) => {
        draft.value = e.target.value;
    }, []);

    return (
        <>
            <div ref={chatWindowRef} class='w-full h-[calc(100%-6rem)] px-2 md:px-6 flex flex-col bg-background bg-chat-tile overflow-y-auto shadow-inner'>
                {messageList.value.map((m) => ( <MessageItem message={m} /> ))}
            </div>
            <div class="h-12 flex flex-row justify-center">
                <input type="text" value={draft} onInput={update} class="h-10 w-9/12 my-1 px-2 rounded-md shadow-md focus:outline-none"  />
                <PrimaryButton onClick={() => gooi(draft.value)} class="h-10 my-1 mx-2">Gooi</PrimaryButton>
            </div>
        </>
    )
}
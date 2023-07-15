import { useCallback, useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { Message, SocketMessageType, WsData } from "models/ws.ts";
import { PrimaryButton } from "../components/PrimaryButton.tsx"
import { MessageItem } from "components/MessageItem.tsx";
import { Session } from "models/db.ts";

interface GooiProps { 
    session: Session,
    url: string,
    messages: Message[]
}

export default function Gooi(props: GooiProps) {

    const messageList = useSignal<Message[]>(props.messages);
    const draft = useSignal<string>('');

    const chatWindowRef = useRef<HTMLDivElement>(null);
    const textInputRef = useRef<HTMLInputElement>(null);

    const ws = useSignal<WebSocket | null>(null);

    useEffect(() => {
        if (textInputRef.current) textInputRef.current.addEventListener('keydown', submitOnEnter);

        if (props.session) {

            const wsUrl = "ws://" + props.url + "/api/ws";
            console.log("Connect using: ", wsUrl);

            ws.value = new WebSocket(wsUrl);
            ws.value.onopen    = ()  => { console.log('Connected..') }
            ws.value.onmessage = updateMessages;
        }
        
    }, []);

    useEffect(() => {
        if (chatWindowRef.current) chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: "smooth"});

    }, [chatWindowRef.current?.scrollHeight]);

    const submitOnEnter = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (!e.repeat) {
                gooi(draft.value);
            }
            e.preventDefault();
        }
    }, []);
    
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
                    session: props.session,
                    text: text
                }
            }

            ws.value.send(JSON.stringify(data));
            if (textInputRef.current) draft.value = '';
        }
    }, [ws]);

    const update = useCallback((e) => {
        draft.value = e.target.value;
    }, []);

    return (
        <>
            <div ref={chatWindowRef} class='w-full h-[calc(100%-6rem)] px-2 md:px-6 flex flex-col bg-background bg-chat-tile overflow-y-auto shadow-inner'>
                {messageList.value.map((m) => ( <MessageItem message={m} /> ))}
            </div>
            <div class="h-12 flex flex-row justify-center">
                <input ref={textInputRef} type="text" value={draft} onInput={update} class="h-10 w-9/12 my-1 px-2 rounded-md shadow-md focus:outline-none"  />
                <PrimaryButton onClick={() => gooi(draft.value)} class="h-10 my-1 mx-2">Gooi</PrimaryButton>
            </div>
        </>
    )
}
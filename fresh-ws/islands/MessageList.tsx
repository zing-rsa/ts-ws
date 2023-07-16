import { useRef, useEffect, useCallback } from "preact/hooks"
import { useSignal } from "@preact/signals";

import { Message, SocketMessageType, WsData } from "models/ws.ts"
import TypingIndicator from "components/TypingIndicator.tsx";
import { MessageItem } from "components/MessageItem.tsx"
import { wsClient } from "util/wsClient.ts";
import { Session } from "models/db.ts";

interface MessageListProps {
    messages: Message[],
    session: Session
}

export default function MessageList(props: MessageListProps) {
    
    const messageList = useSignal<Message[]>(props.messages);
    const typing = useSignal<boolean>(false); 
    
    const chatWindowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatWindowRef.current) chatWindowRef.current.scrollTo({ top: chatWindowRef.current.scrollHeight, behavior: "smooth"});
    }, [messageList.value]);

    useEffect(() => {
        if (wsClient.value) {
            wsClient.value.addEventListener('message', handleWsUpdate);
        }
    }, [wsClient.value]);

    const handleWsUpdate = useCallback((m: MessageEvent<string>) => {
        const data: WsData = JSON.parse(m.data);

        switch (data.type){
            case SocketMessageType.Text: {
                messageList.value = [...messageList.value, data.value];
                break;
            }
            case SocketMessageType.UserAction: {
                typing.value = data.value.typing;
                break;
            }
        }
    }, []);

    return (
        <>
            <div ref={chatWindowRef} class='w-full px-2 md:px-6 flex flex-col overflow-y-auto shadow-inner bg-chat-tile'>
                {messageList.value.map((m) => ( <MessageItem message={m} own={m.session.sessionId == props.session.sessionId}/> ))}
                <div class="w-24 h-3 mx-2">{typing.value ? <TypingIndicator /> : <>&nbsp;</>}</div>
            </div>
        </>
    )
}
import { Ref } from "preact/hooks";

import { MessageItem } from "components/MessageItem.tsx";
import { Message } from "models/ws.ts";

interface MessageListProps {
    messages: Message[],
    ref: Ref<HTMLDivElement> | undefined
}

export default function MessageList(props: MessageListProps) {

    return (
        <div ref={props.ref} class='w-full h-[calc(100%-6rem)] px-6 bg-background bg-chat-tile overflow-y-auto shadow-inner'>
            {props.messages.map((m) => ( <MessageItem message={m} /> ))}
        </div>
    )
}

import { MessageItem } from "./MessageItem.tsx";
import { Message } from "../models.ts";

export function MessageList(props: {messages: Message[]}) {
    return (
        <div 
        class='w-full h-[calc(100%-6rem)] px-6 bg-background bg-chat-tile overflow-y-auto shadow-inner'>
            {props.messages.map((m) => ( <MessageItem message={m} /> ))}
        </div>
    )
}

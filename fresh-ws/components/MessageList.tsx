import { MessageItem } from "./MessageItem.tsx";
import { Message } from "../models.ts";

export function MessageList(props: {messageList: Message[]}) {
    return (
        <div>{props.messageList.map((m) => ( <MessageItem {...m} /> ))}</div>
    )
}

import { Message } from "../models.ts";

type MessageProps = Message

export function MessageItem(props: {message: MessageProps}){

    return (
        <div class='bg-white rounded-lg flex flex-col h-48'>
            <div class="h-4 font-2xs px-2 italic text-">{props.message.username}</div>
            <div class="bg-purple">{props.message.text}</div>
        </div>
    )
}
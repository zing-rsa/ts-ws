import { Message } from "../models.ts";

type MessageProps = Message

export function MessageItem(props: {message: MessageProps}){

    return (
        <div>
            <h3>{props.message.username}</h3>
            <p>{props.message.text}</p>
        </div>
    )
}
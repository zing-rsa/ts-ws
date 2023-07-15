import { Message } from "models/ws.ts";

interface MessageProps {
    message: Message
}

export function MessageItem(props: MessageProps){

    return (
        <div class='min-h-12 w-fit m-2 p-1 flex flex-col rounded-lg bg-white '>
            <div class="text-sm italic flex items-center">
                <div class={`w-2 h-2 bg-[${props.message.session.accent}] rounded-full`}></div>
                <div class="mx-2">{props.message.session.username}</div>
                </div>
            <div class="min-w-[4rem] md:min-w-[8rem] max-w-[12rem] md:max-w-[30rem] lg:max-w-[40rem]">{props.message.text}</div>
        </div>
    )
}
import { Message } from "models/ws.ts";

interface MessageProps {
    message: Message,
    own: boolean
}

const ownStyle   = 'bg-accent text-text-light rounded-l-lg ml-auto'
const otherStyle = 'bg-white  rounded-r-lg'

export function MessageItem(props: MessageProps){
    return (
        <div class={`min-h-12 w-fit m-2 p-1 flex flex-col rounded-t-lg ${props.own ? ownStyle : otherStyle}`}>
            <div class="text-sm italic flex items-center">
                <div class={`w-2 h-2 bg-[${props.message.session.accent}] rounded-full`}></div>
                <div class="mx-2">{props.message.session.username}</div>
                </div>
            <div class="min-w-[4rem] md:min-w-[8rem] max-w-[12rem] md:max-w-[30rem] lg:max-w-[40rem]">{props.message.text}</div>
        </div>
        
    )
}
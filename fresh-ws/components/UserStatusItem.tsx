import { Session } from "models/db.ts";

interface UserStatusItemProps {
    session: Session
}

export default function UserStatusItem(props: UserStatusItemProps) {
    return (
        <div class="w-36 h-8 mx-auto my-1 px-2 flex items-center rounded-md bg-white">
            <div class={`w-6 h-6 bg-[${props.session.accent}] rounded-full`}></div>
            <div class="h-min mx-2">{props.session.username}</div>
        </div>
    )
}
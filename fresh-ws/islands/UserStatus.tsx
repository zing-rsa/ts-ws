import { useCallback, useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals"

import UserStatusItem from "components/UserStatusItem.tsx";
import { SocketMessageType, WsData } from "models/ws.ts";
import { wsClient } from "util/wsClient.ts";
import { Session } from "models/db.ts";

interface UserStatusProps {
    sessions: Session[]
}

export default function UserStatus(props: UserStatusProps) {

    const sessions = useSignal<Session[]>(props.sessions);

    useEffect(() => {
        if(wsClient.value){
            wsClient.value.addEventListener('message', handleWsUpdate)
        }
    }, [wsClient.value]);

    const handleWsUpdate = useCallback((e: MessageEvent<string>) => {
        const data: WsData = JSON.parse(e.data);

        if (data.type == SocketMessageType.AccountState){
            if(data.value.online){
                sessions.value = [...sessions.value, data.value.session]
            } else {
                sessions.value = sessions.value.filter((s) => s.sessionId != data.value.session.sessionId);
            }
        }
    }, []);

    console.log(sessions.value)

    return (
        <div class="hidden lg:flex flex-col w-48 bg-tertiary">
            <div class="w-full h-12 px-4 text-center text-text-light">
                Online
            </div>
            {sessions.value.map((s) => <UserStatusItem session={s} />)}
        </div>
    )
}
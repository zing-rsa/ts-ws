import { useCallback, useEffect, useMemo, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";

import { PrimaryButton } from "../components/PrimaryButton.tsx"
import { SocketMessageType, WsData } from "models/ws.ts";
import { Session } from "models/db.ts";
import { wsClient, connect } from 'util/wsClient.ts'

interface GooiProps { 
    session: Session,
    url: string
}

export default function Gooi(props: GooiProps) {

    const draft = useSignal<string>('');
    
    const textInputRef = useRef<HTMLInputElement>(null);

    const typingData = useMemo(() => ({
        type: SocketMessageType.UserAction,
          value: {
            typing: true,
            session: props.session
        }
    }), []);

    useEffect(() => {
        if (textInputRef.current) textInputRef.current.addEventListener('keydown', submitOnEnter);

        if (props.session) {
            connect(props.url);
        }
    }, []);
    
    const gooi = useCallback((text: string) => {
        if (wsClient.value) {
            
            const data: WsData = {
                type: SocketMessageType.Text,
                value: {
                    session: props.session,
                    text: text
                }
            }
            
            wsClient.value.send(JSON.stringify(data));
            if (textInputRef.current) draft.value = '';
        }
    }, [wsClient]);
    
    const submitOnEnter = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            if (!e.repeat) {
                gooi(draft.value);
            }
            e.preventDefault();
        }
    }, []);

    const notifyLogin = useCallback(() => {
        if (wsClient.value) {
            wsClient.value.send(JSON.stringify(loginData));
        }
    }, [wsClient.value]);

    const update = useCallback((e) => {
        if (wsClient.value) wsClient.value.send(JSON.stringify(typingData))
        draft.value = e.target.value;
    }, []);
    
    return (
        <div class="h-12 flex flex-row justify-center bg-primary">
            <input ref={textInputRef} type="text" value={draft} onInput={update} class="h-10 w-9/12 my-1 px-2 rounded-md shadow-inner focus:outline-none"  />
            <PrimaryButton onClick={() => gooi(draft.value)} class="h-10 my-1 mx-2">Gooi</PrimaryButton>
        </div>
    )
}
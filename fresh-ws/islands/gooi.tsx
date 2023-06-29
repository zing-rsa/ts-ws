import { useCallback, useEffect } from "https://esm.sh/preact@10.15.1/hooks";
import { useSignal } from "https://esm.sh/*@preact/signals@1.1.3";
import { Button } from "../components/Button.tsx"

export const isBrowser = typeof window !== "undefined";

export default function Gooi() {

    // const ws = useSignal(isBrowser ? new WebSocket("ws://localhost:5000") : null);
    const ws = useSignal(new WebSocket("ws://localhost:5000"));

    const gooi = useCallback((text: string) => {
        if (ws.value) ws.value.send(text);
    }, [ws]);

    useEffect(() => {
        if (ws.value) {
            ws.value.onopen    = ()  => { console.log('Connected..') }
            ws.value.onmessage = (m) => { console.log(m.data) }
        }
    }, []);

    return (
        <Button onClick={() => gooi('test')}>Gooi</Button>
    )
}
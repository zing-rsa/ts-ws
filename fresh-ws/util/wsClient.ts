import { signal } from "@preact/signals-core"

export const wsClient = signal<WebSocket | null>(null);

export function connect(url: string) {
    console.log("Socket client connecting: ", url);

    wsClient.value = new WebSocket(url);
    
    console.log('Socket client connected..')
}
import { ObjectId } from "https://deno.land/x/mongo/mod.ts"

export interface Message {
    _id: ObjectId;
    username: string;
    text: string;
    timestamp: number;
}

export interface Client {
    username: string;
    connection: WebSocket;
}

export interface WsData {
    type: SocketMessageType;
    value: string;
}

export enum SocketMessageType {
    Text,
    MessageDelete,
    TypeStart,
    TypeEnd
}
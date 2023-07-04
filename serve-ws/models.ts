import { ObjectId } from "https://deno.land/x/mongo/mod.ts"

export interface Message {
    _id: ObjectId;
    username: string;
    text: string;
    timestamp?: number;
}

export interface Client {
    username: string;
    connection: WebSocket;
}

// export interface WsData {
//     type: SocketMessageType;
//     value: WsTextValue | WsMessageDeleteValue | WsTypingValue;
// }

export type WsData = {
    type: SocketMessageType.Text;
    value: WsTextValue
} | {
    type: SocketMessageType.MessageDelete;
    value: WsMessageDeleteValue
} | {
    type: SocketMessageType.TypeStart | SocketMessageType.TypeEnd;
    value: WsTextValue
}

export interface WsTextValue {
    text: string,
    username: string, 
    timestamp?: number
}

export interface WsMessageDeleteValue {
    id: string
}

export interface WsTypingValue {
    username: string
}

export enum SocketMessageType {
    Text = "Text",
    MessageDelete = "MessageDelete",
    TypeStart = "TypeStart",
    TypeEnd = "TypeEnd"
}
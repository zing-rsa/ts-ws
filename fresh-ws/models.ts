export interface Message {
    text: string,
    username: string
}

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
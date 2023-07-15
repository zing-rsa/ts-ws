import { Session } from "models/db.ts";

export interface Client {
    session: Session;
    connection: WebSocket;
}

export interface Message {
    text: string,
    session: Session
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
} | {
    type: SocketMessageType.Login | SocketMessageType.Logout;
    value: WsTextValue
}

export interface WsTextValue {
    text: string,
    session: Session,
    timestamp?: number
}

export interface WsMessageDeleteValue {
    id: string
}

export interface WsTypingValue {
    session: Session
}

export interface WsAccountStateValue {
    session: Session
}

export enum SocketMessageType {
    Text = "Text",
    MessageDelete = "MessageDelete",
    TypeStart = "TypeStart",
    TypeEnd = "TypeEnd",
    Login = "Login",
    Logout = "Logout"
}
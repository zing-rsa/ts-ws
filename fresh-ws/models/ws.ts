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
    type: SocketMessageType.UserAction
    value: WsTypingValue
} | {
    type: SocketMessageType.AccountState
    value: WsAccountStateValue
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
    typing: boolean,
    session: Session
}

export interface WsAccountStateValue {
    online: boolean,
    session: Session
}

export enum SocketMessageType {
    Text = "Text",
    MessageDelete = "MessageDelete",
    UserAction = "UserAction",
    AccountState = "AccountState"
}
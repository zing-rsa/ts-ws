import { Handlers, PageProps } from "$fresh/server.ts";

import MessageList from "islands/MessageList.tsx";
import ToolBar from "components/ToolBar.tsx";
import { Message } from "models/ws.ts";
import { Session } from "models/db.ts";
import Gooi from "islands/Gooi.tsx";
import { State } from 'models/mw.ts'
import { APP_URL } from "config";
import { db } from "mongo";
import UserStatus from "islands/UserStatus.tsx";

const mongo = db();
const messages = mongo.collection<Message>('messages')
const sessions = mongo.collection<Session>('sessions')

export const handler: Handlers<any, State> = {
    async GET(req, ctx) {

        const session = await sessions.findOne({ sessionId: ctx.state.cookies['sessionId'] })
        
        if (!session) return new Response(null, {status: 400});

        const recentMessages = await messages.find({}, {
            limit: 20
        }).toArray();

        const activeSessions = await sessions.find({}).toArray();

        return ctx.render({
            session,
            recentMessages,
            activeSessions
        }); 
    }
}

interface chatProps {
    session: Session,
    recentMessages: Message[]
    activeSessions: Session[]
}

export default function Chat(props: PageProps<chatProps>) {

    return (
        <>
            <ToolBar />
            <div class="flex h-screen">
                <div class='h-5/6 w-9/12 m-auto my-1/6 bg-secondary shadow-lg rounded-md no-collapse'>
                    <div class="h-12 text-center flex flex-col justify-center bg-primary rounded-t-md">
                        <div>CHAT</div>
                    </div>
                    <div class='w-full h-[calc(100%-6rem)] flex'>
                        <MessageList messages={props.data.recentMessages} />
                        <UserStatus sessions={props.data.activeSessions} />
                    </div>
                    <Gooi session={props.data.session} url={APP_URL}></Gooi>
                </div>
            </div>
        </>
    )
}
import { Handlers, PageProps } from "$fresh/server.ts";

import MessageList from "islands/MessageList.tsx";
import UserStatus from "islands/UserStatus.tsx";
import ToolBar from "components/ToolBar.tsx";
import { APP_URL, WS_PTCL } from "config";
import { Message } from "models/ws.ts";
import { Session } from "models/db.ts";
import Gooi from "islands/Gooi.tsx";
import { State } from 'models/mw.ts'
import { db } from "mongo";

const mongo = db();
const messages = mongo.collection<Message>('messages')
const sessions = mongo.collection<Session>('sessions')

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
    async GET(_req, ctx) {

        const session = await sessions.findOne({ sessionId: ctx.state.cookies['sessionId'] })
        
        if (!session) return new Response(null, {status: 400});
        
        const recentMessages = await messages.find().skip((await messages.countDocuments()) - 20).toArray();
        
        const activeSessions = await sessions.find().toArray();

        console.log(activeSessions);

        return ctx.render({
            session,
            recentMessages,
            activeSessions
        }); 
    }
}

interface ChatProps {
    session: Session,
    recentMessages: Message[]
    activeSessions: Session[]
}

export default function Chat(props: PageProps<ChatProps>) {

    return (
        <>
            <ToolBar />
            <div class="flex h-screen">
                <div class='h-[calc(100%-4rem)] sm:h-[90%] w-11/12 sm:w-9/12 mx-auto mt-12 sm:mt-2/6 bg-background shadow-2xl rounded-md no-collapse overflow-hidden'>
                    <div class="h-12 text-center flex flex-col justify-center bg-primary rounded-t-md text-text-light">
                        <div>Chat</div>
                    </div>
                    <div class='w-full h-[calc(100%-6rem)] flex'>
                        <MessageList messages={props.data.recentMessages} session={props.data.session}/>
                        <UserStatus sessions={props.data.activeSessions} />
                    </div>
                    <Gooi session={props.data.session} url={`${WS_PTCL}${APP_URL}/api/ws`}></Gooi>
                </div>
            </div>
        </>
    )
}
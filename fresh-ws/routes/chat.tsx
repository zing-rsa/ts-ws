import { Handlers, PageProps } from "$fresh/server.ts";

import ToolBar from "components/ToolBar.tsx";
import Gooi from "../islands/gooi.tsx";
import { Message } from "models/ws.ts";
import { Session } from "models/db.ts";
import { State } from 'models/mw.ts'
import { APP_URL } from "config";
import { db } from "mongo";

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

        return ctx.render({
            session,
            recentMessages
        }); 
    }
}

interface chatProps {
    session: Session,
    recentMessages: Message[]
}

export default function Chat(props: PageProps<chatProps>) {

    return (
        <>
            <ToolBar />
            <div class="flex h-screen">
                <div class='h-5/6 w-9/12 m-auto my-1/6 bg-secondary shadow-lg rounded-md no-collapse overflow-y-scroll'>
                    <div class="h-12 text-center flex flex-col justify-center">
                        <div>CHAT</div>
                    </div>
                    <Gooi session={props.data.session} messages={props.data.recentMessages} url={APP_URL}></Gooi>
                </div>
            </div>
        </>
    )
}3
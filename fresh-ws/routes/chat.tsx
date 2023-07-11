import { Handlers, PageProps } from "$fresh/server.ts";

import ToolBar from "components/ToolBar.tsx";
import Gooi from "../islands/gooi.tsx";
import { Message } from "models/ws.ts";
import { APP_URL } from "config";
import { db } from "mongo";

const mongo = db();
const messages = mongo.collection<Message>('messages')

export const handler: Handlers = {
    async GET(req, ctx) {

        const queryParams = new URL(req.url).searchParams;
        const username = queryParams.get('username');

        const recentMessages = await messages.find({}, {
            limit: 20
        }).toArray();

        return ctx.render({
            username,
            recentMessages
        }); 
    },
    async POST(req, ctx) {

        console.log('chat post')
        const form = await req.formData();
        const username = form.get('username')?.toString();

        if (username === null || username === "" || username === undefined){
            return new Response(
                null,
                {
                    status: 400
                }
            )
        } else {
            console.log('setting username to: ', username);
        }
        
        const recentMessages = await messages.find({}, {
            limit: 20
        }).toArray();

        return ctx.render({
            username,
            recentMessages
        }); 
    }
}


interface chatProps {
    username: string,
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
                    <Gooi username={props.data.username} messages={props.data.recentMessages} url={APP_URL}></Gooi>
                </div>
            </div>
        </>
    )
}3
import { Handlers } from "$fresh/server.ts";
import { UUID } from "$mongo";

import { APP_URL, HTTP_PTCL } from "config";
import { Session } from 'models/db.ts'
import { db } from "mongo";
import { State } from "models/mw.ts";

const mongo = db();
const sessions = mongo.collection<Session>('sessions');

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
    async POST(req, ctx) {

        const activeSession = await sessions.findOne({ sessionId: ctx.state.cookies['sessionId'] })

        if(activeSession) {
            await sessions.deleteOne({ sessionId: activeSession.sessionId });
        }

        const form = await req.formData();
        const username = form.get('username')?.toString();
        const sessionId = new UUID().toString();

        if (username === null || username === "" || username === undefined){
            return new Response(null, {status: 400})
        }

        const session: Session = {
            username,
            sessionId,
            accent: '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6),
            createdAt: new Date()
        }

        await sessions.insertOne(session);

        const headers = new Headers();
        headers.set('location', "/chat");
        headers.set('Set-Cookie', `sessionId=${sessionId}; HttpOnly; Max-Age=3600; Path=/; SameSite=Strict`);
        
        return new Response(null,{ status: 303, headers});
    }
}

export default function Home() {
  return (
    <div class='w-full h-full bg-index-tile p-1'>
        <div class="h-64 w-96 m-auto mt-64 bg-background rounded-md p-0 flex flex-col shadow-2xl no-collapse font-roboto text-text-light">
            <div class='my-8 text-center text-lg' >Welcome!</div>
            <form method='post' action={`${HTTP_PTCL}${APP_URL}`}>
                <div class="flex flex-col items-center">
                    <label class="text-sm my-1">Choose a username:</label>
                    <input type='text' name='username' value='' class="rounded-md h-8 w-48 focus:outline-none p-2 shadow-lg text-text" />
                    <button type='submit' class="w-32 h-8 bg-btn-primary rounded-md my-8 text-light">Login</button>
                </div>
            </form>
        </div>
    </div>
  );
}

import { Handlers } from "$fresh/server.ts"

import { Session } from "models/db.ts";
import { State } from "models/mw.ts";
import { db } from "mongo";

const mongo = db();
const sessions = mongo.collection<Session>('sessions')

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
    async POST(_req, ctx) {

        await sessions.deleteOne({ sessionId: ctx.state.cookies['sessionId'] })

        const headers = new Headers;

        headers.set('location', '/');
        headers.set('Set-Cookie', `sessionId=null; HttpOnly; Max-Age=0; Path=/; SameSite=Strict`);

        return new Response(null, { status: 303, headers })
    }
}
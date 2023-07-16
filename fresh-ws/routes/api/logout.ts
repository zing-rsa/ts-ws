import { Handlers } from "$fresh/server.ts"

import { APP_URL, HTTP_PTCL } from "config";

export const handler: Handlers = {
    async POST(req, ctx) {
        const headers = new Headers;

        // headers.set('location', HTTP_PTCL + APP_URL);
        headers.set('location', '/');
        headers.set('Set-Cookie', `sessionId=null; HttpOnly; Max-Age=0; Path=/; SameSite=Strict`);

        return new Response(null, { status: 303, headers })
    }
}
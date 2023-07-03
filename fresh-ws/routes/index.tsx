import { Handlers } from "https://deno.land/x/fresh@1.2.0/server.ts";

import { username } from "../states/userstate.ts";

export const handler: Handlers = {
    async POST(req, ctx) {
        const form = await req.formData();
        const user = form.get('username')?.toString();

        username.value = user;

        console.log('setting user to: ', user);

        const headers = new Headers();
        headers.set('location', "/chat");
        return new Response(
            null,
            {
                status: 303,
                headers
            }
        )
    }
}


export default function Home() {

  return (
    <div>
        <h1>Login</h1>
        <form method='post'>
            <label>username</label>
            <input type='text' name='username' value='' />
            <button type='submit' >Login</button>
        </form>
    </div>
  );
}

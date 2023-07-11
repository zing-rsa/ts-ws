import { Handlers } from "$fresh/server.ts";
import { APP_URL } from "config";

export const handler: Handlers = {
    async POST(req, ctx) {
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

        const headers = new Headers();
        headers.set('location', "/chat?username="+ username); // would be nice to not send this in the query
        
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
    <div class="h-64 w-96 m-auto mt-64 bg-secondary rounded-md p-0 flex flex-col shadow-xl no-collapse font-roboto">
        <div class='my-8 text-center text-lg font-bold'>Welcome!</div>
        <form method='post' action={`http://${APP_URL}/chat`}>
            <div class="flex flex-col items-center">
                <label class="text-sm text-primary my-1">Choose a username:</label>
                <input type='text' name='username' value='' class="rounded-md h-8 w-48 focus:outline-none p-2" />
                <button type='submit' class="w-32 h-8 bg-primary rounded-md my-8 text-background">Login</button>
            </div>
        </form>
    </div>
  );
}

import { Handlers, PageProps } from "$fresh/server.ts";

import Gooi from "../islands/gooi.tsx";
import * as config from '../config.ts'
import ToolBar from "components/ToolBar.tsx";
import { APP_URL } from "config";
import { PropertyAccessExpression } from "https://deno.land/x/ts_morph@17.0.1/ts_morph.js";
import { SignatureHelpRetriggeredReason } from "https://deno.land/x/ts_morph@17.0.1/common/typescript.js";

export const handler: Handlers = {
    async GET(req, ctx) {

        const queryParams = new URL(req.url).searchParams;
        const username = queryParams.get('username');

        console.log(username)

        return ctx.render(username); // add db.messages to this
    }
}

type UsernameProps = string;

export default function Chat(props: PageProps<UsernameProps>) {

    // if (config.env == "dev" && !props.username ) props.username = 'test';

    console.log(props.data)

    return (
        <>
            <ToolBar />
            <div class="flex h-screen">
                <div class='h-5/6 w-9/12 m-auto my-1/6 bg-secondary shadow-lg rounded-md no-collapse overflow-y-scroll'>
                    <div class="h-12 text-center flex flex-col justify-center">
                        <div>CHAT</div>
                    </div>
                    <Gooi username={props.data} url={APP_URL}></Gooi>
                </div>
            </div>
        </>
    )
}
import { username } from "../states/userstate.ts";
import Gooi from "../islands/gooi.tsx";
import * as config from '../config.ts'
import ToolBar from "../components/ToolBar.tsx";

export default function Chat() {

    if (config.env == "dev") username.value = 'test';

    return (
        <>
            <ToolBar />
            <div class="flex h-screen">
                <div class='h-5/6 w-9/12 m-auto my-1/6 bg-secondary shadow-lg rounded-md no-collapse overflow-y-scroll'>
                    <div class="h-12 text-center flex flex-col justify-center">
                        <div>CHAT</div>
                    </div>
                    <Gooi username={username.value}></Gooi>
                </div>
            </div>
        </>
    )
}
import { username } from "../states/userstate.ts";
import Gooi from "../islands/gooi.tsx";

export default function Chat() {

    return (

        <div>
            <div>CHAT</div> 
            
            <Gooi username={username.value}></Gooi>
        </div>

    )
}
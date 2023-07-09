import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function AccentButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={!IS_BROWSER || props.disabled} 
            class={"px-2 bg-accent text-background rounded-md shadow-lg hover:cursor-pointer " + props.class}
    />
    )
}
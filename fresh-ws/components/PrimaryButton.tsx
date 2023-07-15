import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function PrimaryButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return <button
        {...props}
        disabled={!IS_BROWSER || props.disabled} 
        class={"px-2 bg-primary text-background rounded-md shadow-lg hover:cursor-pointer " + props.class}
    />
}
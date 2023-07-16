import { JSX } from "preact";

export function AccentButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            class={"px-2 bg-accent text-background rounded-md shadow-lg hover:cursor-pointer " + props.class}
    />
    )
}
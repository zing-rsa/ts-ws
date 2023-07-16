import { JSX } from "preact";

export function PrimaryButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
    return <button
        {...props}
        type='submit'
        class={"px-2 rounded-md shadow-lg hover:cursor-pointer bg-btn-primary text-text-light " + props.class}
    />
}
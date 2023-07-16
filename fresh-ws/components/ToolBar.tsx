import { PrimaryButton } from './PrimaryButton.tsx'
import { APP_URL, HTTP_PTCL } from '../config.ts'

export default function ToolBar() {
    return (
        <form method='post' action={`${HTTP_PTCL}${APP_URL}/api/logout`} class='w-full fixed flex'>
            <PrimaryButton class="h-8 my-2 ml-auto mr-12">Logout</PrimaryButton>
        </form>
    )
}
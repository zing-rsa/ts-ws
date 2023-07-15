import { AccentButton } from './AccentButton.tsx'

export default function ToolBar() {
    return (
        <div class='w-full h-12 fixed flex'> 
            <AccentButton class="h-8 my-2 ml-auto mr-12">Logout</AccentButton>
        </div>
    )
}
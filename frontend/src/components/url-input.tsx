"use client";

import {useFormStatus} from 'react-dom';

export default function UrlInput({url}) {

    const {pending} = useFormStatus()

    return (
        <input className="placeholder:italic placeholder:text-slate-400 m-2 bg-neutral-200 rounded-md px-2 py-1
               focus:outline-none focus:bg-neutral-100 w-full" defaultValue={url} disabled={pending}
               placeholder="Type your URL ..." type="text" name="url"/>
    )
}
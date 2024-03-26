"use client";

import {useFormStatus} from 'react-dom';

export default function MethodSelect({method}) {

    const {pending} = useFormStatus()

    return (
        <select id="method" name="method" className="m-2 px-0 md:px-2 py-1 rounded-md border-0 text-gray-600
                bg-neutral-50 hover:bg-white shadow-sm appearance-none text-center"
                value={method} disabled={pending} onChange={()=>{}}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
            <option>INFO</option>
            <option>DUMB</option>
        </select>
    )
}
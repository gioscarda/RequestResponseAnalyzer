"use client";

import {useFormStatus} from 'react-dom';
import {Spinner} from "@nextui-org/react";

export default function SubmitButton() {

    const {pending} = useFormStatus()

    return (
        <button type="submit" disabled={pending} className={`m-2 px-1 md:px-6 py-1 rounded-md bg-blue-500 text-gray-100 
                ${pending ? 'bg-transparent p-0 md:p-0' : 'hover:bg-blue-600 focus-visible:outline shadow-sm'}`}>
            {pending ?
                <Spinner size="sm" color="primary" className="p-0 m-0"/>
            :
                <>
                    <span className="hidden md:block">SEND</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                         className="w-6 h-6 md:hidden">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59
                                 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"/>
                    </svg>
                </>
            }
        </button>
    )
}
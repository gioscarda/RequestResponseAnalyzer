"use client";

import {CopyToClipboard} from "react-copy-to-clipboard";
import {useEffect, useState} from "react";

export default function Share({
    id=''
}: {
    id?: string
}) {

    const [copied, setCopied] = useState(false)
    const [link, setLink] = useState<string | undefined>()
    const copy = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }
    useEffect(() => {
        setLink(`${window.location.href}${id}`)
    }, [id]);

    return (
        <div className="text-center order-4 text-wrap w-[calc(80dvw)]">
            <h1 className="text-xl mb-3">SHARE</h1>
            <CopyToClipboard text={link} onCopy={copy}>
                <span className="bg-neutral-200 rounded-2xl px-2 py-1">{link}</span>
            </CopyToClipboard>
            {copied && <span className="blue-500 px-4">Copied to clipboard</span>}
        </div>
    );
}

"use client";

import {CopyToClipboard} from 'react-copy-to-clipboard';
import {useState} from "react";

export default function Share({data}) {

    const [copied, setCopied] = useState(false)
    const copy = () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }

    return (
        <div className={`text-center order-4`}>
            <h1 className="text-xl mb-3">SHARE</h1>
            <CopyToClipboard text={data} onCopy={copy}>
              <span className="bg-neutral-200 rounded-2xl px-2 py-1">{data}</span>
            </CopyToClipboard>
            { copied && <span className="blue-500 px-4">Copied to clipboard</span>}
        </div>
    );
}

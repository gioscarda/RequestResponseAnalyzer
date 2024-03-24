"use client";

import { useState } from "react";
import ResponseStatus from "@/components/response-status";
import RequestForm from "@/components/request-form";
import Share from "@/components/share";
import Details from "@/components/details";
import TimingAnalysisPanel from "@/components/timing-analysis-panel";
import { sendRequest } from "@/actions/api-actions";

export default function Home() {

    const [status, setStatus] = useState()
    const [details, setDetails] = useState()
    const [shareLink, setShareLink] = useState()
    const [id, setId] = useState()

    const sendURL = async (formData: FormData) => {
        const res = await sendRequest(formData)
        if (res) {
            setId(res.id)
            setStatus(res.status)
            setDetails({url_info: res.url_info, responses: res.responses})
            setShareLink(`${window.location.href}${res.id}`)
        }
    }

    return (
        <main className="flex flex-col h-[calc(100dvh)] items-center px-[calc(10dvw)] pt-[calc(5dvh)] pb-[calc(15dvh)]
              gap-y-[calc(3dvh)]">
            <RequestForm formAction={sendURL}/>
            { status && <ResponseStatus data={status}/> }
            { details && <Details data={details}/> }
            { shareLink && <Share data={shareLink}/> }
            { id && <TimingAnalysisPanel id={id}/> }
        </main>
    );
}

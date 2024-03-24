"use client";

import RequestForm from "@/components/request-form";
import Details from "@/components/details";
import Share from "@/components/share";
import TimingAnalysisPanel from "@/components/timing-analysis-panel";
import {useEffect, useState } from "react";
import {getRequest} from "@/actions/api-actions";

export default function ReadOnlyDetails({params}: { params: { id: string } }) {

    const [url, setUrl] = useState()
    const [method, setMethod] = useState()
    const [details, setDetails] = useState()
    const [shareLink, setShareLink] = useState()

    const fetchRequest = async () => {
        const res = await getRequest(params.id)
        setUrl(res.url)
        setMethod(res.method)
        setDetails({url_info: res.url_info, responses: res.responses})
        setShareLink(window.location.href)
    }

    useEffect(() => {
        fetchRequest()
    }, [params.id]);

    return (
        <main className="flex flex-col h-[calc(100dvh)] items-center px-[calc(10dvw)] pt-[calc(5dvh)] pb-[calc(15dvh)]
              gap-y-[calc(3dvh)]">
            <RequestForm method={method} url={url}/>
            <Details data={details}/>
            <Share data={shareLink}/>
            <TimingAnalysisPanel id={params.id}/>
        </main>
    );
}

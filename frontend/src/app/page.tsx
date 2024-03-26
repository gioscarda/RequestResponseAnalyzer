"use client";

import {useState} from "react";
import ResponseDetails from "@/components/response-details";
import ResponseStatus from "@/components/response-status";
import RequestForm from "@/components/request-form";
import Share from "@/components/share";
import TimingAnalysisPanel from "@/components/timing-analysis-panel";
import {sendRequest} from "@/actions/api-actions";
import {isMobileDevice} from "@/libs/device";

export default function Home() {

    const [id, setId] = useState()
    const [status, setStatus] = useState()
    const [details, setDetails] = useState()
    const [errors, setErrors] = useState()
    const [isMobile, setIsMobile] = useState(false);

    async function sendURL(formData: FormData) {
        // Check if mobile device
        const mobile = await isMobileDevice()
        setIsMobile(mobile)
        // Call backend API
        const json_res = await sendRequest(formData)
        // Checking response from the ID field
        if (json_res.id) {
            setId(json_res.id)
            setStatus(json_res.status)
            setDetails({url_info: json_res.url_info, responses: json_res.responses})
        } else {
            setErrors(json_res)
            setTimeout(() => setErrors(undefined), 5000)
        }
    }

    return (
        <main className="flex flex-col h-[calc(100dvh)] items-center px-[calc(10dvw)] pt-[calc(5dvh)] pb-[calc(15dvh)]
              gap-y-[calc(3dvh)]">
            <RequestForm action={sendURL}/>
            {errors && Object.keys(errors).map((field) => (
                <div key={field} className="bg-red-200 text-red-900 p-2 rounded-md order-3">{errors[field]}</div>
            ))}
            {status && <ResponseStatus data={status}/>}
            {details && <ResponseDetails data={details}/>}
            {id && <Share id={id}/>}
            {id && isMobile && <TimingAnalysisPanel id={id}/>}
        </main>
    );
}

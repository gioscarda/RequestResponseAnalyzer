import RequestForm from "@/components/request-form";
import ResponseDetails from "@/components/response-details";
import Share from "@/components/share";
// import TimingAnalysisPanel from "@/components/timing-analysis-panel";
import {getRequest} from "@/actions/api-actions";

export default async function ReadOnlyHome({params}: { params: { id: string } }) {

    const res = await getRequest(params.id)

    return (
        <main className="flex flex-col h-[calc(100dvh)] items-center px-[calc(10dvw)] pt-[calc(5dvh)] pb-[calc(15dvh)]
              gap-y-[calc(3dvh)]">
            <RequestForm method={res?.method} url={res?.url}/>
            <ResponseDetails data={{url_info: res.url_info, responses: res.responses}}/>
            <Share/>
            {/*<TimingAnalysisPanel id={params.id}/>*/}
        </main>
    );
}

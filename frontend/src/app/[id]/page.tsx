import RequestForm from "@/components/request-form";
import ResponseDetails from "@/components/response-details";
import Share from "@/components/share";
import TimingAnalysisPanel from "@/components/timing-analysis-panel";
import {getRequest} from "@/actions/api-actions";
import {isMobileDevice} from "@/libs/device";

export default async function ReadOnlyHome({params}: { params: { id: string } }) {

    // Check if mobile
    const isMobile = await isMobileDevice();

    const res = await getRequest(params.id)

    return (
        <main className="flex flex-col h-[calc(100dvh)] items-center px-[calc(10dvw)] pt-[calc(5dvh)] pb-[calc(15dvh)]
              gap-y-[calc(3dvh)]">
            {res && res.id ?
                <>
                    <RequestForm method={res?.method} url={res?.url}/>
                    <ResponseDetails data={{url_info: res.url_info, responses: res.responses}}/>
                    <Share/>
                    {isMobile && <TimingAnalysisPanel id={res.id}/>}
                </>
            :
                <div className="text-center w-full font-semibold text-amber-700">No data found</div>
            }
        </main>
    );
}

export default function ResponseDetails({data}) {
    return (
        <div className={`grid grid-flow-col auto-cols-[1fr] gap-2 text-gray-600 font-medium w-full overflow-x-scroll
         order-3`}>
            <div className="bg-neutral-50 rounded-md min-h-[calc(40dvh)] border border-neutral-200 w-[calc(80dvw)]
                 md:w-full">
                <div className="grid grid-flow-row gap-0.5">
                    <div className="pb-3 pt-1 px-2">URL INFO</div>
                    <div className="bg-neutral-200 py-1 px-2">
                        <div className="font-bold">DOMAIN</div>
                        <div>{data?.url_info.domain}</div>
                    </div>
                    <div className="bg-neutral-200 py-1 px-2">
                        <div className="font-bold">SCHEME</div>
                        <div>{data?.url_info.scheme}</div>
                    </div>
                    <div className="bg-neutral-200 py-1 px-2">
                        <div className="font-bold">PATH</div>
                        <div>{data?.url_info.path}</div>
                    </div>
                </div>
            </div>
            {data?.responses.sort((a, b) => b.id - a.id).map(function (response) {
                return (
                    <div className="rounded-md border border-neutral-200 min-h-[calc(40dvh)] w-[calc(80dvw)] md:w-full"
                         key={response.id}>
                        <div className="grid grid-flow-row gap-0.5">
                            <div className="bg-white pt-1 px-2">RESPONSE</div>
                            <div className="bg-neutral-50 py-1 px-2">
                                <div>{response.protocol} {response.status} {response.reason}</div>
                            </div>
                            { response.location &&
                                <div className="bg-neutral-50 py-1 px-2">
                                    <div>Location: {response.location}</div>
                                </div>
                            }
                            { response.date &&
                                <div className="bg-neutral-50 py-1 px-2">
                                    <div>Date: {response.date}</div>
                                </div>
                            }
                            <div className="bg-neutral-50 py-1 px-2">
                                <div>Server: {response.server}</div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

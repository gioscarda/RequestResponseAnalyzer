export default function ResponseStatus({data}) {
    return (
        <div className={`text-center order-2 md:order-1`}>
            <h1 className="text-5xl mb-2">{data?.code}</h1>
            <p>{data?.message}</p>
        </div>
    );

}

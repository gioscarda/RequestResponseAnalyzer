type TResponse = {
    id: number,
    protocol: string,
    status: string,
    reason: string,
    location: string,
    date: string,
    server: string
}
type TUrlInfo = {
    domain: string,
    scheme: string,
    path: string
}
type TResponseDetails = {
    url_info: TUrlInfo,
    responses: TResponse[]
}
type TDistribution = {
    max: number,
    min: number,
    proportion: number
}
type TMetric = {
    percentile: number,
    distributions: TDistribution[],
    category: string
}
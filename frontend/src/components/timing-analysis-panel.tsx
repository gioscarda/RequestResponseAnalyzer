"use client";

import {useEffect, useState, UIEvent, TouchEvent, Touch} from "react";
import {getTimingData} from "@/actions/api-actions";
import Speedometer from "@/components/speedometer";
import {Spinner} from "@nextui-org/react";

export default function TimingAnalysisPanel({id}: {id: string}) {

    const [delta, setDelta] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [previousTouch, setPreviousTouch] = useState<Touch>();
    const [height, setHeight] = useState(10);
    const [overflow, setOverflow] = useState('overflow-y-hidden');
    const [metrics, setMetrics] = useState<Record<string, TMetric>>()
    const [warnings, setWarnings] = useState<Record<string, string>>()
    const [errors, setErrors] = useState<Record<string, string>>()
    const [loading, setLoading] = useState(false)

    async function fetchRequest(sleep: number) {
        setLoading(true)
        let res = await getTimingData(id, sleep)
        if (res.warnings) {
            setWarnings(res.warnings)
        } else if (res.errors) {
            setErrors(res.errors)
        } else if (res.metrics) {
            setMetrics(res.metrics)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchRequest(0)
    }, [id]);

    useEffect(() => {
        if (warnings?.loading) {
            fetchRequest(3)
        }
    }, [warnings]);

    const getMetricName = (name: string): string => {
        return name.replaceAll("_MS", "").replaceAll("_", " ")
    }

    const getMetricValue = (metric: TMetric, metric_name: string): string => {
        let unit: string = ' ms';
        const value: number = metric.percentile;
        if (metric_name.endsWith('SCORE')) {
            unit = '';
        }
        return `${String(value)}${unit}`
    }

    const handleMove = (e: TouchEvent): void => {
        const current: Touch = e.changedTouches[0]
        if (current != undefined && previousTouch != undefined) {
            const delta = (previousTouch.pageY - current.pageY) / window.innerHeight * 100
            setDelta(delta)
            if (scrollTop == 0) {
                setHeight(currentHeight => currentHeight + delta)
            }
        }
        setPreviousTouch(e.changedTouches[0])
    };
    const draggingStop = (e: TouchEvent): void => {
        if (scrollTop == 0) {
            if (height >= 50 && height < 98) {
                if (delta > 0) {
                    setHeight(98)
                    setOverflow('overflow-y-scroll')
                } else {
                    setHeight(50)
                    setOverflow('overflow-y-hidden')
                }
            } else if (height < 50) {
                setOverflow('overflow-y-hidden')
                if (delta > 0) {
                    setHeight(50)
                } else {
                    setHeight(10)
                }
            }
        }
    }
    const handleScroll = (e: UIEvent): void => {
        setScrollTop((e.target as HTMLElement)?.scrollTop)
    }
    const draggingStart = (e: TouchEvent): void => {
        setPreviousTouch(e.changedTouches[0])
    }

    return (
        <div className={`w-full text-center absolute bottom-0 max-h-[calc(98dvh)] min-h-[calc(10dvh)] bg-white
             rounded-t-xl shadow-[gray_0px_0px_5px_0px] ${overflow}`} style={{height: `calc(${height}dvh)`}}
             onScroll={handleScroll} onTouchEndCapture={draggingStop} onTouchStartCapture={draggingStart}
             onTouchMove={handleMove}>
            <div className="z-10 fixed w-full bg-white text-left text-neutral-400 rounded-t-xl font-bold text-xl py-7
                px-5">
                Timing Analysis
            </div>
            <div className="fixed flex justify-center w-full bg-white rounded-t-xl z-20">
                <div className="w-[calc(40dvw)] h-[7px] bg-gray-300 rounded m-2"></div>
            </div>
            <div className="bg-white flex flex-col items-center text-center justify-center pb-10 pt-20 mx-5">
                {loading ?
                    <div className="w-full flex flex-col justify-center relative mt-16">
                        <Spinner size="lg" color="primary"/>
                    </div>
                    : metrics ?
                        Object.keys(metrics).map((k: string) => (
                            <div className="flex flex-col flex-nowrap my-6" key={k}>
                                <div className="absolute inset-x-0 text-2xl font-medium mt-28">
                                    {metrics[k].category.toLowerCase() + '!'}
                                </div>
                                <div className="flex-auto">
                                    <Speedometer data={metrics[k]}/>
                                </div>
                                <div className="text-neutral-300 font-bold text-2xl text-center text-wrap mx-5">
                                    {getMetricName(k)}
                                </div>
                                <div className="text-gray-500 font-bold text-2xl text-center text-wrap mx-5">
                                    {getMetricValue(metrics[k], k)}
                                </div>
                            </div>
                        ))
                        : errors ?
                            <div className="w-[calc(80dvw)]">
                                {Object.keys(errors).map((k: string) => (
                                    <div key={k} className="text-red-600 p-2 rounded-md break-words">
                                        {errors[k]}
                                    </div>
                                ))}
                            </div>
                            : warnings &&
                            <div className="w-[calc(80dvw)]">
                                {Object.keys(warnings).map((k: string) => (
                                    <div key={k}>
                                        {k === 'loading' ?
                                            <div className="w-full flex flex-col justify-center relative my-16">
                                                <Spinner size="lg" color="primary"/>
                                            </div>
                                            :
                                            <div className="text-amber-700 p-2 rounded-md break-words">
                                                {warnings[k]}
                                            </div>
                                        }
                                    </div>
                                ))}
                            </div>
                }
            </div>
        </div>
    );
}

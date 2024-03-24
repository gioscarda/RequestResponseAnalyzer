"use client";

import { useEffect, useState, Suspense } from "react";
import { getTimingData } from "@/actions/api-actions";
import Speedometer from "@/components/speedometer";

export default function TimingAnalysisPanel({id}) {

    const [delta, setDelta] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);
    const [previousTouch, setPreviousTouch] = useState();
    const [height, setHeight] = useState(10);
    const [overflow, setOverflow] = useState('overflow-y-hidden');
    const [metrics, setMetrics] = useState({})

    const fetchRequest = async () => {
        const res = await getTimingData(id)
        setMetrics(res)
    }

    useEffect(() => {
        fetchRequest()
    }, [id]);

    const getMetricName = (name) => {
        return name.replaceAll("_MS", "").replaceAll("_", " ")
    }

    const getMetricValue = (metric, metric_name) => {
        let unit = ' ms';
        const value = metric.percentile;
        if (metric_name.endsWith('SCORE')) {
            unit = '';
        }
        return String(value) + unit
    }

    const handleMove = (e) => {
        const current = e.changedTouches[0]
        if (current != undefined && previousTouch != undefined) {
            const delta = (previousTouch.pageY - current.pageY) / window.innerHeight * 100
            setDelta(delta)
            if (scrollTop == 0) {
                setHeight(currentHeight => currentHeight + delta)
            }
        }
        setPreviousTouch(e.changedTouches[0])
    };
    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop)
    }
    const draggingStop = (e) => {
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
    const draggingStart = (e) => {
        setPreviousTouch(e.changedTouches[0])
    }

    return (
        <div className={`text-center absolute bottom-0 w-full max-h-[calc(98dvh)] min-h-[calc(10dvh)] md:hidden 
           rounded-t-xl shadow-[gray_0px_0px_5px_0px] bg-white ${overflow}`} style={{height: `calc(${height}dvh)`}}
             onScroll={handleScroll} onTouchEndCapture={draggingStop} onTouchStartCapture={draggingStart}
             onTouchMove={handleMove}>
            <div className="z-10 fixed w-full bg-white text-left px-5 text-neutral-400 rounded-t-xl font-bold text-xl pt-7">
                Timing Analysis
            </div>
            <div className="fixed flex justify-center w-full bg-white rounded-t-xl z-20">
                <div className="w-[40dvw] h-[7px] bg-gray-300 rounded m-2"></div>
            </div>
            <Suspense fallback={<div className="bg-red-500 h-10 w-full">Loading ...</div>}>
                <div className="bg-white flex flex-col items-center text-center justify-center pb-5 pt-14 gap-10 mx-20">
                    {Object.keys(metrics).map((k) => (
                        <div className="w-full flex flex-col justify-center relative" key={k}>
                            <div className="absolute inset-x-0 text-2xl font-medium">
                                {metrics[k].category.toLowerCase() + '!'}
                            </div>
                            <Speedometer data={metrics[k]}/>
                            <div className="text-neutral-300 font-bold text-2xl text-center w-full">
                                {getMetricName(k)}
                            </div>
                            <div className="text-gray-500 font-bold text-2xl text-center w-full">
                                {getMetricValue(metrics[k], k)}
                            </div>
                        </div>
                    ))}
                </div>
            </Suspense>
        </div>
    );
}

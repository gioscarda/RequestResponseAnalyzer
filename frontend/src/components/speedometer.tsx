"use client";

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

const GaugeComponent = dynamic(() => import('react-gauge-component'), {ssr: false});

type TTick = {
    value: number
}
type TLimit = {
    limit: number
}

export default function Speedometer({data}: {data: TMetric}) {

    const [subArcsLimits, setSubArcsLimits] = useState<TLimit[]>()
    const [ticks, setTicks] = useState<TTick[]>()
    const [ticksValue, setTicksValue] = useState<Record<number, number>>()

    const getTickValue = (tick: number): string => {
        return ticksValue ? String(ticksValue[tick]) : ''
    }

    useEffect(() => {
        let ticksValue: Record<number, number> = {}
        let ticks: TTick[] = []
        let limits: TLimit[] = []
        let limit: number = 0
        data.distributions.map((d, i) => {
            if (d.proportion > 0) {
                limit += d.proportion
                const value = Math.round(limit * 1000)
                limits.push({limit: value})
                if (i < data.distributions.length - 1 && value < 1000) {
                    ticks.push({value: value})
                    ticksValue[value] = d.max
                }
            }
        })
        setSubArcsLimits(limits);
        setTicks(ticks);
        setTicksValue(ticksValue);
    }, [data]);

    return (
            <GaugeComponent className="text-center p-5"
                marginInPercent={{top: 0.04, bottom: 0.02, left: 0.2, right: 0.2}}
                type="radial"
                pointer={{type: "blob", animationDelay: 10}}
                value={750}
                minValue={0}
                maxValue={1000}
                arc={{
                    colorArray: ['#67e153', '#08f681', '#f6ef08', '#ff5733'],
                    padding: 0.02,
                    width: 0.1,
                    subArcs: subArcsLimits
                }}
                labels={{
                    valueLabel: {
                        hide: true
                    },
                    tickLabels: {
                        type: "outer",
                        hideMinMax: true,
                        ticks: ticks,
                        defaultTickValueConfig: {formatTextValue: tick => getTickValue(tick)},
                        defaultTickLineConfig: {
                            hide: true
                        }
                    }
                }}
            />
    );
}

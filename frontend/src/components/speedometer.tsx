"use client";

import dynamic from "next/dynamic";
import {useEffect, useState} from "react";

const GaugeComponent = dynamic(() => import('react-gauge-component'), {ssr: false});

export default function Speedometer({data}) {

    const [subArcsLimits, setSubArcsLimits] = useState()
    const [ticks, setTicks] = useState()
    const [ticksValue, setTicksValue] = useState()
    const [value, setValue] = useState()

    const getTickValue = (tick) => {
        return ticksValue[tick]
    }

    useEffect(() => {
        let ticksValue = {}
        let ticks = []
        let limits = []
        let limit = 0
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
                marginInPercent={{top: 0.02, bottom: 0.02, left: 0.2, right: 0.2}}
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

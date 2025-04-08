import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts"

export function SimpleChart(props: {
    data: { year: string, value: number }[],
    onClick: () => void
}) {
    const { onClick } = props;
    const [data, setData] = useState<{ year: string, value: number }[]>([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    return <SimpleLineChart data={data} onClick={onClick}/>
}

function SimpleLineChart(props: {
    data: { year: string, value: number }[],
    onClick: () => void
}) {
    return (
        <div style={{ height: '300px' }}>
            <ResponsiveContainer>
                <LineChart
                    onClick={props.onClick}
                    data={props.data}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
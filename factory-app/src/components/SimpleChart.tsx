import { useState } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts"

const chartClickHandler = () => {
    console.log("chart click works");
};

export function SimpleChart() {
    const [data, setData] = useState<{ year: string, value: number }[]>([
        { year: "1991", value: 3 },
        { year: "1992", value: 4 },
        { year: "1993", value: 3.5 },
        { year: "1994", value: 5 },
        { year: "1995", value: 4.9 },
        { year: "1996", value: 6 },
        { year: "1997", value: 7 },
        { year: "1998", value: 9 },
        { year: "1999", value: 13 }
    ]);

    return <SimpleLineChart data={data} onClick={chartClickHandler}/>
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
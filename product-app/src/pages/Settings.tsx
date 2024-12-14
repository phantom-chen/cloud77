import ApexCharts from "react-apexcharts";

function generateData(count: number, yrange: { min: number, max: number }) {
    var i = 0;
    var series = [];
    while (i < count) {
        var x = "w" + (i + 1).toString();
        var y =
            Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

        series.push({
            x: x,
            y: y,
        })

        i++;
    }

    return series;
}


const series = [
    {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41],
    },
];

const options = {
    dataLabels: {
        enabled: false,
    },
    tooltip: {
        x: {
            format: "dd/MM/yy HH:mm",
        },
    },
    chart: {
        toolbar: {
            show: false,
        },
    },
    legend: {
        show: false,
    },
};

const options2 = {
    chart: {
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    }
};

const series2 = [
    {
        name: "Metric1",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric2",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric3",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric4",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric5",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric6",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric7",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric8",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
    {
        name: "Metric9",
        data: generateData(18, {
            min: 0,
            max: 90,
        }),
    },
];
export function Settings() {

    return (
        <>
            <p>settings work</p>
            <div>
                <p style={{ textDecoration: "none" }}>settings works</p>
                <p style={{ textDecoration: "line-through" }}>settings works</p>
                <form onSubmit={() => { }}>
                    <input placeholder="hello"/>
                    <button type='submit'>Add Todo</button>
                </form>

                <ApexCharts
                    options={options}
                    series={series}
                    type="area"
                    height={350}
                />
                <ApexCharts
                    options={options2}
                    series={series2}
                    type="heatmap"
                    height={350}
                />
            </div>
        </>
    )
}
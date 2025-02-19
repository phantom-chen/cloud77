export const CompanyData = {
    nodes: [
        {
            id: '1',
            label: '公司1'
        },
        {
            id: '2',
            label: '公司2'
        },
        {
            id: '3',
            label: '公司3'
        },
        {
            id: '4',
            label: '公司4'
        },
        {
            id: '5',
            label: '公司5'
        },
        {
            id: '6',
            label: '公司6'
        },
        {
            id: '7',
            label: '公司7'
        },
        {
            id: '8',
            label: '公司8'
        },
        {
            id: '9',
            label: '公司9'
        }
    ],
    edges: [
        {
            source: '1',
            target: '2',
            data: {
                type: 'name1',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '1',
            target: '3',
            data: {
                type: 'name2',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '2',
            target: '5',
            data: {
                type: 'name1',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '5',
            target: '6',
            data: {
                type: 'name2',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '3',
            target: '4',
            data: {
                type: 'name3',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '4',
            target: '7',
            data: {
                type: 'name2',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '1',
            target: '8',
            data: {
                type: 'name2',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        },
        {
            source: '1',
            target: '9',
            data: {
                type: 'name3',
                amount: '100,000,000,00 元',
                date: '2019-08-03'
            }
        }
    ]
};

export const PVData = [
    { pv: 2400 },
    { pv: 1398 },
    { pv: 9800 },
    { pv: 3908 },
    { pv: 4800 },
    { pv: 3490 },
    { pv: 4300 }
];

export const UVData = [
    { name: "Jan", uv: 3700 },
    { name: "Feb", uv: 3000 },
    { name: "Mar", uv: 2000 },
    { name: "Apr", uv: 2780 },
    { name: "May", uv: 2000 },
    { name: "Jun", uv: 1800 },
    { name: "Jul", uv: 2600 },
    { name: "Aug", uv: 2900 },
    { name: "Sep", uv: 3500 },
    { name: "Oct", uv: 3000 },
    { name: "Nov", uv: 2400 },
    { name: "Dec", uv: 2780 }
];
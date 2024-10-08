import React, { FC, useEffect } from 'react';
import G6, { Graph } from '@antv/g6';

const data = {
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

export const Company: FC = () => {
    const ref = React.useRef(null);
    let graph: Graph | undefined;

    useEffect(() => {
        if (!graph && ref.current) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            graph = new G6.Graph({
                container: ref.current,
                width: 1200,
                height: 800,
                modes: {
                    default: ['drag-canvas'],
                },
                layout: {
                    type: 'dagre',
                    direction: 'LR',
                },
                defaultNode: {
                    type: 'node',
                    labelCfg: {
                        style: {
                            fill: '#000000A6',
                            fontSize: 10,
                        },
                    },
                    style: {
                        stroke: '#72CC4A',
                        width: 150,
                    },
                },
                defaultEdge: {
                    type: 'polyline',
                },
            });
        }
        if (graph) {
            graph.data(data);
            graph.render();
        }
    }, []);

    return <div ref={ref}></div>;
}

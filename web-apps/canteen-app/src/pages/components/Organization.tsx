import React, { useEffect } from 'react';
import G6, { Graph } from '@antv/g6';
import { CompanyData } from '../data';

const Organization: React.FC = () => {
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
            graph.data(CompanyData);
            graph.render();
        }
    }, []);

    return (
        <div>
            <h1>Organization Component</h1>
            <div ref={ref}></div>
        </div>
    );
};

export default Organization;
import { faker } from "@faker-js/faker";
import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import Graph, { MultiDirectedGraph, UndirectedGraph } from "graphology";
import erdosRenyi from "graphology-generators/random/erdos-renyi";
import { FC, useEffect, useMemo } from "react";
import "@react-sigma/core/lib/react-sigma.min.css";

export const SigmaNodeGraph: FC = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        const graph = new Graph();
        graph.addNode("first", { x: 0, y: 0, size: 15, label: "My first node", color: "#FA4F40" });
        loadGraph(graph);
    }, [loadGraph]);

    return null;
}

export const SigmaNodesGraph: FC = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        // Create the graph
        const graph = new MultiDirectedGraph({
            type: 'directed'
        });
        graph.addNode("A", { x: 0, y: 0, label: "Node A", size: 10 });
        graph.addNode("B", { x: 1, y: 1, label: "Node B", size: 10 });
        graph.addEdgeWithKey("rel1", "A", "B", { label: "REL_1" });
        graph.addEdgeWithKey("rel2", "A", "B", { label: "REL_2" });

        loadGraph(graph);
    }, [loadGraph]);

    return null;
};

export const GraphEvents: FC = () => {
    const registerEvents = useRegisterEvents();

    useEffect(() => {
        registerEvents({
            clickNode: (event) => console.log("clickNode", event),
        });
    }, [registerEvents]);
    
    return null;
}

export const SigmaRandowGraph: React.FC = () => {
    const loadGraph = useLoadGraph();

    const randomColor = useMemo(() => {
        return (): string => {
            const digits = "0123456789abcdef";
            let code = "#";
            for (let i = 0; i < 6; i++) {
                code += digits.charAt(Math.floor(Math.random() * 16));
            }
            return code;
        };
    }, []);

    useEffect(() => {
        const graph = erdosRenyi(UndirectedGraph, {
            order: 100,
            probability: 0.1
        });
        graph.nodes().forEach((node: string) => {
            graph.mergeNodeAttributes(node, {
                label: faker.name.fullName(),
                size: faker.datatype.number({ min: 4, max: 20, precision: 1 }),
                color: randomColor(),
                x: Math.random(),
                y: Math.random()
            });
        });
        graph.edges().forEach((edge: string) => {
            graph.mergeEdgeAttributes(edge, {
                weight: Math.random()
            });
        });
        loadGraph(graph);
    }, [loadGraph, randomColor]);

    return null;
};

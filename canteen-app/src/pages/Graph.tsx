import { Box, Tab } from '@mui/material';
import React from 'react';
import { SigmaContainer } from '@react-sigma/core';
import { MultiDirectedGraph } from 'graphology';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { GraphEvents, SigmaNodeGraph, SigmaNodesGraph, SigmaRandowGraph } from './components/Graphs';

const Graph: React.FC = () => {
    const [value, setValue] = React.useState('0');

    return (
        <div>
            <h1>Graph Component</h1>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={(e, v) => setValue(v)} aria-label="lab API tabs example">
                            <Tab label="Sigma Graph (Node)" value="0" />
                            <Tab label="Sigma Graph (Nodes)" value="1" />
                            <Tab label="Sigma Graph (Random)" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="0">
                        <SigmaContainer className="graph-container" style={{ height: "500px", width: "500px" }}>
                            <SigmaNodeGraph />
                        </SigmaContainer>
                    </TabPanel>
                    <TabPanel value="1">
                        <SigmaContainer
                            graph={MultiDirectedGraph}
                            className="graph-container"
                            style={{ height: "600px" }}
                            settings={{
                                renderEdgeLabels: true,
                                // defaultEdgeType: 'arrow'
                            }}
                        >
                            <SigmaNodesGraph />
                            <GraphEvents />
                        </SigmaContainer>
                    </TabPanel>
                    <TabPanel value="2">
                        <>
                            <SigmaContainer className="graph-container" style={{ height: "600px", width: "80%" }}>
                                <SigmaRandowGraph />
                            </SigmaContainer>
                        </>
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
};

export default Graph;
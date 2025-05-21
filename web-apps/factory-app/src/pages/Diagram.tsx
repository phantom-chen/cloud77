import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography } from "@mui/material";
import ReactMarkdown from 'react-markdown';
import { CodeEditor, GridEditor } from './Editor';

const Code = `# Your markdown here
// some comment
// some comment"
// some comment"`;

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Diagram: React.FC = () => {
    const [post, setPost] = useState('');
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        setPost(Code);    
    }, []);

    return (
        <div>
            <p>This is the Diagram page content.</p>
            <Tabs value={value} onChange={(e, v) => setValue(v)} aria-label="simple tabs example">
                <Tab label="Variables" {...a11yProps(0)} />
                <Tab label="Signals" {...a11yProps(1)} />
            </Tabs>
            {
                value === 0 ?  <p>variables</p> : undefined
            }
            {
                value === 1 ?  <p>signals</p> : undefined
            }
            <div style={{width:'100%'}}>
                <GridEditor />
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    <CodeEditor code={post} />
                </div>
                <div style={{ flex: 1 }}>
                    <ReactMarkdown>{post}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default Diagram;
import { AppBar, Tabs, Tab, Box, Typography } from "@mui/material";
import { useState } from "react";
import { CodeEditor, GridEditor, MarkdownPreview } from "../components";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Diagram() {
    const [value, setValue] = useState<number>(0);

    return (
        <>
            <Tabs value={value} onChange={(e, v) => setValue(v)} aria-label="simple tabs example">
                <Tab label="AG Grid" {...a11yProps(0)} />
                <Tab label="Monaco Editor" {...a11yProps(1)} />
                <Tab label="Markdown Preview" {...a11yProps(2)} />
            </Tabs>
            {
                value === 0 ?  <GridEditor /> : undefined
            }
            {
                value === 1 ?  <CodeEditor /> : undefined
            }
            {
                value === 2 ?  <MarkdownPreview /> : undefined
            }
        </>

    )
}
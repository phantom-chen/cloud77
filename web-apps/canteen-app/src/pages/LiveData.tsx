import { Box, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from './models/socket';

const LiveData: React.FC = () => {

    const [value, setValue] = useState('0');
    const [sessionId, setSessionId] = useState('');
    const socketRef = useRef<Socket>(createSocket());
    
    useEffect(() => {
        socketRef.current?.on('session-id', (arg: { id: string }) => {
            setSessionId(arg.id);
        });
    }, [])

    return (
        <>
            <Typography variant='h6' component='div'>live data page works</Typography>
            {
                sessionId ? <Typography variant="h6" component='div'>Session Id: {sessionId}</Typography> : undefined
            }
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={(e, v) => setValue(v)} aria-label="lab API tabs example">
                            <Tab label="Chat" value="0" />
                            <Tab label="Rooms" value="1" />
                            <Tab label="Documents" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="0">
                        <p>chat tab works</p>
                    </TabPanel>
                    <TabPanel value="1">
                        <p>rooms tab works</p>
                    </TabPanel>
                    <TabPanel value="2">
                        <p>documents tab works</p>
                    </TabPanel>
                </TabContext>
            </Box>
        </>
    )
}

export default LiveData;
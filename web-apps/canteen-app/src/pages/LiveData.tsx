import { Box, Button, Tab, Typography } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from './models/socket';
import { LoginDialog } from './components/LoginDialog';

const LiveData: React.FC = () => {

    const [value, setValue] = useState('0');
    const [userName, setUserName] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [online, setOnline] = useState(0);
    const socketRef = useRef<Socket>(createSocket());
    
    useEffect(() => {
        socketRef.current?.on("connect", () => {
            console.log(socketRef.current?.connected); // true
        });
        socketRef.current?.on("disconnect", () => {
            console.log(socketRef.current?.connected); // false
        });
        socketRef.current?.io.on("reconnect_attempt", () => {
            console.log('reconnect_attempt');
        });
        socketRef.current?.io.on("reconnect", () => {
            console.log('reconnect_attempt');
        });
        socketRef.current?.on('session-id', (arg: { id: string }) => {
            setSessionId(arg.id);
        });
        socketRef.current?.on('online', (arg: { online: number }) => {
            setOnline(arg.online);
        });
        socketRef.current?.on('update-user-response', (arg: { succeed: boolean, error: string }) => {
            console.log(arg);
        });
    }, [])

    useEffect(() => {

    })

    useEffect(() => {
        const handleTabClose = (event: BeforeUnloadEvent) => {
            socketRef.current?.disconnect();
            // event.preventDefault();
            // event.returnValue = ""; // Required for modern browsers to show a confirmation dialog
        };

        // Add the event listener
        window.addEventListener("beforeunload", handleTabClose);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("beforeunload", handleTabClose);
        };
    }, []);

    return (
        <>
            <LoginDialog open={userName.length === 0} onClose={(e, p) => {
                setUserName(e);
                // save user name in session
                socketRef.current?.emit('update-user', { username: e, password: p });
            }} />
            {
                userName ? <Typography variant="h6" component='div'>Session Id: {sessionId}, Online users: {online}, Current user: {userName}</Typography> : undefined
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
                        <>
                        <p>chat tab works</p>
                        <Button variant='contained' onClick={() => {
                            
                        }}></Button>
                        </>
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
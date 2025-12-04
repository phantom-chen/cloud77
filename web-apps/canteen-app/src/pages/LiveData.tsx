import { Box, Button, Tab, TextField, Typography, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket } from './models/socket';
import { LoginDialog } from './components/LoginDialog';
import { Rooms } from './components/Rooms';
import { Documents } from './components/Documents';
import ChatPanel from './components/Chat';
import axios from 'axios';
import { IChatRoom } from '../models/chat-room';

const LiveData: React.FC = () => {

    const [userName, setUserName] = useState('');
    const [sessionId, setSessionId] = useState('');
    const [online, setOnline] = useState(0);
    const [apiKey, setApiKey] = useState('');

    const [broadcastMessage, setBroadcastMessage] = useState<string>('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [rooms, setRooms] = useState<IChatRoom[]>([]);
    const [documents, setDocuments] = useState<{ id: string, title: string }[]>([]);

    // const [isLogin, setIsLogin] = useState<boolean>(true);
    const [selectedValue, setSelectedValue] = useState('');

    const socketRef = useRef<Socket>(createSocket());

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedValue(event.target.value as string);
    };

    useEffect(() => {
        axios.get('api/gateway', {
            headers: {
                'x-api-version': 'v1'
            }
        })
            .then(response => {

                console.log(response.data);
                const data = response.data;
                console.log(data)
                localStorage.setItem('sso_url', data.sso);
                localStorage.setItem('home_url', data.home);
                localStorage.setItem('api_key', data.key);
                setApiKey(data.key);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

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
        
        socketRef.current?.on("msgToClient", (arg) => {
            console.log(arg);
            setReceivedMessages(msgs => [...msgs, arg + ' ' + new Date().toLocaleString()]);
        })

        socketRef.current?.on("broadcastToOthers", (arg) => {
            console.warn(arg);
            setBroadcastMessage(arg);
        });

        socketRef.current?.on("broadcastToAll", (arg) => {
            console.warn(arg);
            setBroadcastMessage(arg);
        });

        socketRef.current?.on('rooms', (arg: { rooms: IChatRoom[] }) => {
            console.log(arg);
            setRooms(arg.rooms);
        });
        socketRef.current?.on('update-user-response', (arg: { succeed: boolean, error: string, username: string, token: string }) => {
            console.log(arg);
            if (arg.token) {
                sessionStorage.setItem('canteen_socket_session_token', arg.token);
                // setIsLogin(true);
            }
            if (arg.username) {
                setUserName(arg.username);
            }
        });

        socketRef.current?.on('documents', (arg: { documents: { id: string, title: string}[]}) => {
            console.log(arg);
            setDocuments(arg.documents);
        })

        socketRef.current?.on('document-changed', (msg) => {
            console.log(msg);
        })
    }, [])

    useEffect(() => {
        if (sessionStorage.getItem('canteen_socket_session_token')) {
            // setIsLogin(true);
            socketRef.current?.emit('update-user', { username: '', password: '', token: sessionStorage.getItem('canteen_socket_session_token') });
        } else {
            // setIsLogin(false);
        }
    }, [])

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
            {/* <LoginDialog open={!isLogin} onClose={(e, p) => {
                setUserName(e);
                // save user name in session
                socketRef.current?.emit('update-user', { username: e, password: p, token: '' });
            }} />
            {
                isLogin ? <Typography variant="h6" component='div'>Session Id: {sessionId}, Online users: {online}, Current user: {userName}</Typography> : undefined
            } */}
            <Typography variant="h6" component='div'>Session Id: {sessionId}</Typography>
            <Typography variant="h6" component='div'>Online users: {online}</Typography>
            {
                broadcastMessage ? <Box sx={{ backgroundColor: '#f0f0f0', padding: '10px', marginTop: '10px', marginBottom: '10px' }}>
                    <Typography variant="body1" component='div'>Broadcast message: {broadcastMessage}</Typography>
                </Box> : undefined
            }
            <FormControl fullWidth>
                <InputLabel>Part</InputLabel>
                <Select
                    value={selectedValue}
                    label="Part"
                    onChange={handleChange}
                >
                    <MenuItem value={''}>Session</MenuItem>
                    <MenuItem value={'chat'}>Chat</MenuItem>
                    <MenuItem value={'rooms'}>Rooms</MenuItem>
                    <MenuItem value={'documents'}>Documents</MenuItem>
                </Select>
            </FormControl>
            {
                selectedValue === '' ? <>
                    <p>placeholder</p>
                </> : undefined
            }
            {
                selectedValue === 'rooms' ? <Rooms
                    rooms={rooms}
                    getRooms={() => {
                        socketRef.current?.emit('get-rooms-request', { account: { token: 'xxx', email: 'user1', user: 'user1' }});
                    }}
                    addRoom={(room: IChatRoom) => {
                        socketRef.current?.emit('add-room-request', { account: { token: 'xxx', email: 'user1', user: 'user1' }, room });
                    }}
                    removeRoom={(id: string, room: string) => {
                        socketRef.current?.emit('remove-room-request', { account: { token: 'xxx', email: 'user1', user: 'user1' }, room: id });
                    }}
                    joinRoom={(id: string, room: string) => {
                        // socketRef.current?.emit('join-room', { name: getUser(), room });
                        alert('WIP');
                    }}
                /> : undefined
            }
            {
                selectedValue === 'documents' ? <Documents 
                    documents={documents}
                    getDocuments={() => {
                        socketRef.current?.emit('get-documents-request', { account: { token: 'xxx', email: 'user1', user: 'user1' }});
                    }}/> : undefined
            }
            {
                selectedValue === 'chat' ? <ChatPanel
                    chatMessages={receivedMessages}
                    sendMessage={(message: string) => {
                        socketRef.current?.emit("msgToServer", { account: { token: 'xxx', email: 'user1', user: 'user1' }, message });
                    }}
                    sendToOthers={(message: string) => {
                        socketRef.current?.emit("msgToOthers", { account: { token: 'xxx', email: 'user1', user: 'user1' }, message });
                    }} /> : undefined
            }
        </>
    )
}

export default LiveData;
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import socketClient, { Socket } from 'socket.io-client';
import { ChatMessage } from "../components";
import { ChatRoom } from "../components/ChatRoom";
import { generateID } from "@phantom-chen/cloud77";

let _socket: Socket;

function createSocket(): Socket {
    if (_socket) return _socket;

    _socket = socketClient('', { path: '/chat-ws' });
    return _socket;
}

export default function Chat() {
    const [online, setOnline] = useState<number>(0);
    const [sessionId, setSessionId] = useState('');
    const [message, setMessage] = useState<string>('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [rooms, setRooms] = useState<string[]>([]);
    const socketRef = useRef<Socket>(createSocket());
    const [value, setValue] = useState('1');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    const sendMessage2Server: (msg: string) => void = (msg: string) => {
        socketRef.current?.emit("msg2server", msg);
    }

    const messageInputEnterKeydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter') {
            sendMessage2Server(message);
            setMessage('');
        }
    }

    useEffect(() => {
        socketRef.current?.on('session-id', (arg: { id: string }) => {
            setSessionId(arg.id);
        });
        socketRef.current?.on("online", (msg: { online: number }) => {
            console.log(msg);
            setOnline(msg.online);
        });

        socketRef.current?.on('get-rooms-response', (msg: { rooms: string[] }) => {
            setRooms(msg.rooms);
        });

        socketRef.current?.on('document-list-changed', (msg: any) => {
            console.log(msg);
        })

        socketRef.current?.on("msg2client", (msg) => {
            setReceivedMessages(msgs => [...msgs, msg]);
            // setMessageInfo([...messageInfo, { from: 'server', timestamp: new Date().toLocaleString(), body: msg }]);
        })
        
        socketRef.current?.on('document-changed', (msg) => {
            console.log(msg);
        })
    }, [])

    return (
        <>
            <div>
                <Typography variant="h6" component='div'>Session Id: {sessionId}</Typography>
                <Typography variant="h6" component='div'>Online: {online}</Typography>
            </div>

            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Chat" value="1" />
                        <Tab label="Document" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div>
                        <div className="message-input">
                            <TextField variant="standard" value={message} placeholder="type your message"
                                onChange={e => setMessage(e.target.value)}
                                onKeyDown={messageInputEnterKeydownHandler} />
                            <Button variant="contained" onClick={() => {
                                sendMessage2Server(message);
                                setMessage('');
                            }}>send</Button>
                        </div>
                        <ul>
                            {
                                receivedMessages.map((m, i) => <li key={i}>Receiver: {m}</li>)
                            }
                        </ul>
                        <div style={{ display: 'flex' }}>
                            <div style={{ flex: '1 1 auto' }}>
                                <div style={{ boxShadow: '1px 1px 2px 2px lightgray' }}>
                                    <List>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar>CQL</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary='test' secondary='123' />
                                        </ListItem>
                                    </List>
                                </div>
                            </div>

                            <div>
                                <ChatRoom
                                    rooms={rooms}
                                    onCreateRoom={(room: string) => {
                                        socketRef.current?.emit('add-room', { room });
                                    }}
                                    onJoinRoom={((room: string) => {
                                        socketRef.current?.emit('join-room', { name: localStorage.getItem('email') || '', room });
                                    })}
                                    onDeleteRoom={(room: string) => {
                                        socketRef.current?.emit('remove-room', { room });
                                    }} />
                                <ChatMessage sender="abc" receiver="efg" content="hello" timestamp="xxx"></ChatMessage>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value="2">
                    <div>
                        <Typography variant="h6" component='div'>Documents</Typography>
                        <Button onClick={(() => {
                            console.log(generateID());
                        })}>add document</Button>
                    </div>
                </TabPanel>
            </TabContext>
        </>
    )
}
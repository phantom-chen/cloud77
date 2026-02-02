import React, { useEffect, useState } from 'react';
import signalRService from '../signalrService';
import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import { ChatMessage } from './ChatMessage';

const ChatComponent = (props: {
    chatMessages: string[],
    sendMessage: (message: string) => void,
    sendToOthers: (message: string) => void}) => {
    const { chatMessages, sendMessage, sendToOthers } = props;
    const [messages, setMessages] = useState<{ user: string, message: string }[]>([]);
    const [user, setUser] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        signalRService.startConnection();

        signalRService.onReceiveMessage((payload: { user: string, message: string }) => {
            setMessages([...messages, { user: payload.user, message: payload.message }]);
        });

        return () => {
            signalRService.connection.off('ReceiveMessage');
        };
    }, [messages]);

    const sendMessageToSignalR = () => {
        signalRService.sendMessage(user, message);
        setMessage('');
    };

    const messageInputEnterKeydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter') {
            sendMessage(message);
            setMessage('');
        }
    }

    return (
        <div>
            <p>SignalR Service</p>
            <div>
                <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="User"
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message"
                />
                <button onClick={() => {
                    sendMessage(message);
                    setMessage('');
                }}>Send</button>
            </div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        {msg.user}: {msg.message}
                    </li>
                ))}
            </ul>

            <p>Socket IO service</p>
            <div className="message-input">
                <TextField variant="standard" value={message} placeholder="type your message"
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={messageInputEnterKeydownHandler} />
                <Button variant="contained" onClick={() => {
                    sendMessage(message);
                    setMessage('');
                }}>Send</Button>
                <Button variant="contained" onClick={() => {
                    sendToOthers(message);
                    setMessage('');
                }}>Send To Others</Button>
            </div>
            <ul>
                {
                    chatMessages.map((m, i) => <li key={i}>Receiver: {m}</li>)
                }
            </ul>
            <ChatMessage sender="abc" receiver="efg" content="hello" timestamp="xxx"></ChatMessage>

            <div style={{ boxShadow: '1px 1px 2px 2px lightgray' }}>
                <List>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>U</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary='test' secondary='123' />
                    </ListItem>
                </List>
            </div>
        </div>
    );
};

export default ChatComponent;
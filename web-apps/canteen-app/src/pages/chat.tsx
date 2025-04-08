import React, { useEffect, useState } from 'react';
import signalRService from './signalrService';

const ChatComponent = () => {
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

    const sendMessage = () => {
        signalRService.sendMessage(user, message);
        setMessage('');
    };

    return (
        <div>
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
                <button onClick={sendMessage}>Send</button>
            </div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        {msg.user}: {msg.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatComponent;
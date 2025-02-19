import React from 'react';
import './Chat.css';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'other';
}

const messages: Message[] = [
    { id: 1, text: 'Hello!', sender: 'other' },
    { id: 2, text: 'Hi there!', sender: 'me' },
    { id: 3, text: 'How are you?', sender: 'other' },
    { id: 4, text: 'I am good, thanks!', sender: 'me' },
];

const Chat: React.FC = () => {
    return (
        <div className="chat-container">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`message ${message.sender === 'me' ? 'message-sender' : 'message-receiver'}`}
                >
                    {message.text}
                </div>
            ))}
        </div>
    );
};

export default Chat;
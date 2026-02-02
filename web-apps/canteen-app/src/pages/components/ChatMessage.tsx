export interface ChatMessageProps {
    sender: string,
    receiver: string,
    timestamp: string,
    content: string
}

export function ChatMessage(props: ChatMessageProps) {
    return (
        <div className="message-item">
            <div>
                <b>{props.sender}</b>
                <span>{props.timestamp}</span>
            </div>
            <span>{props.content}</span>
        </div>
    )
}


export interface ChatMessageInfo {
    from: string,
    timestamp: string,
    body: string
}

export interface ChatMessagesProps {
    User: string,
    Room: string,
    Messages: ChatMessageInfo[]
}

export function ChatMessage() {
    return <div>ChatMessage</div>;
}

export function NewChatMessages(props: ChatMessagesProps) {
    return <div>
        {
            props.Messages.map((msg, index) => <div key={index} style={{ border: '1px solid gray', margin: '5px', padding: '5px' }}>
                <p>From: {msg.from}</p>
                <p>Time: {msg.timestamp}</p>
                <p>Message: {msg.body}</p>
            </div>)
        }
    </div>;
}

export function ChatMessages(props: ChatMessagesProps) {

    return <>
        <div>
            <div className="messages-panel">
                {
                    props.User !== '' ? <h4>User: {props.User}</h4> : null
                }
                {
                    props.Room !== '' ? <h4>Chat room: {props.Room}</h4> : null
                }
                <div className="messages-list">

                </div>
                <NewChatMessages {...props} />
            </div>
        </div>
    </>
}
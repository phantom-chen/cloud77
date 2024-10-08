import { useEffect } from "react";
import { MessageQueue$ } from "../models/sample";

export interface MessageInfo {
    from: string,
    timestamp: string,
    body: string
}


export interface MessagesProps {
    User: string,
    Room: string,
    Messages: MessageInfo[]
}

export function Messages(props: MessagesProps) {
    useEffect(() => {
        const sub = MessageQueue$.subscribe(msg => {
            console.log(msg);
        });

        return () => {
            sub.unsubscribe();
        }
    }, [])

    return (
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
            </div>
        </div>

    );
}

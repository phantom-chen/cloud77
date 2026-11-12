import { useContext, useEffect, useState } from "react";
import { DiagramContext, MessageEventBus, MessageQueue$ } from "../contexts/diagram";
import { Button } from "@mui/material";

function DiagramName() {
    const context = useContext(DiagramContext);

    return <div>{'diagram name is ' + context.name}</div>;
}

export default function Diagram() {
    const [message, setMessage] = useState<string>('');
    const [stamp, setStamp] = useState<string>(new Date().toLocaleTimeString());
    const [page, setPage] = useState<number>(999);

    const messageListener = (value: string) => {
        setMessage(`receive message: ${value}`);
    }

    useEffect(() => {
        const id = setInterval(() => {
            setStamp(new Date().toLocaleTimeString());
        }, 1000);

        return () => {
            clearInterval(id);
        }
    }, []);

    useEffect(() => {
        const sub = MessageQueue$.subscribe(msg => {
            setMessage(`receive message: ${msg}`);
        });
        MessageEventBus.on("hello", messageListener);

        return () => {
            sub.unsubscribe();
            MessageEventBus.removeListener("hello", messageListener);
        }
    }, [])

    return <>
        <DiagramContext.Provider value={{ name: 'diagram_name' }}>
            <div>Diagram <span>{stamp}</span></div>
            <DiagramName />
            <Button onClick={() => {
                MessageQueue$.next('message from rxjs');
            }}>Send message via rxjs</Button>
            <Button onClick={() => {
                MessageEventBus.emit("hello", 'message from event emitter');
            }}>Send message via event emitter</Button>

            <p>{message}</p>

            <Button onClick={() => {
                console.log(MessageEventBus.eventNames());
                console.log(MessageEventBus.listenerCount("hello"));
                console.log(MessageEventBus.listenerCount("hello2"));
            }}>Print event emitter</Button>

            <p>counter works</p>
            <p>page control works</p>
            <p><span>{`current page: ${page}`}</span></p>
        </DiagramContext.Provider>
    </>;
}
import { useCallback, useEffect, useState } from "react"

export default function Message() {
    const [messages, setMessages] = useState<string[]>([]);
    const handleMessage: (event: MessageEvent) => void = useCallback((ev: MessageEvent) =>
    {
        console.log(ev);
        console.log(window.parent);
        if (ev.source !== window.parent) {
            return;
        }
        else {
            if (ev.data) {
                let message: string = '';
                console.log(ev.data);
                if (ev.data.request === 'login') {
                    message = 'receive tokens successfully';
                    localStorage.setItem('accessToken', ev.data.accessToken);
                    localStorage.setItem('refreshToken', ev.data.refreshToken);
                }
                else if (ev.data.request === 'logout')
                {
                    message = 'delete tokens successfully';
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                else if (ev.data.request === 'clear-localstorage')
                {
                    message = 'clear localstorage successfully';
                    localStorage.clear();
                }
                if (message !== '') {
                    console.log(message);
                    setMessages(v => [...v, ...[message]]);
                }
            }
        }
    }, [])

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        }
    });
    
    return (
        <>
        <button onClick={() => {
            window.parent.postMessage('tick from iframe', '*');
        }}>tick</button>
        <div>message works</div>
        {
            messages.map((v, i) => {
                return <div key={i}>{v}</div>
            })
        }
        </>
    )
}
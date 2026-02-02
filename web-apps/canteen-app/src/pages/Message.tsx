import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const Message: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [isLogin, setIsLogin] = useState(true);
    const accessTokenValue = searchParams.get('access_token');
    const refreshTokenValue = searchParams.get('refresh_token');

    const handleMessage: (event: MessageEvent) => void = useCallback((ev: MessageEvent) => {
        if (ev.source !== window.parent) {
            return;
        }
        else {
            if (ev.data) {
                let message: string = '';
                console.log(ev.data);
                if (ev.data.request === 'login') {
                    message = 'receive tokens successfully';
                    sessionStorage.setItem('user_access_token', ev.data.accessToken);
                    sessionStorage.setItem('user_refresh_token', ev.data.refreshToken);
                }
                else if (ev.data.request === 'logout') {
                    message = 'delete tokens successfully';
                    sessionStorage.removeItem('user_access_token');
                    sessionStorage.removeItem('user_refresh_token');
                }
                else if (ev.data.request === 'clear-localstorage') {
                    message = 'clear localstorage successfully';
                    localStorage.clear();
                }
                else {
                    window.parent.postMessage({
                        request: 'invalid-request',
                        message: 'the request is invalid'
                    }, '*');
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

    useEffect(() => {
        sessionStorage.setItem('user_access_token', accessTokenValue ?? '');
    }, [accessTokenValue])

    useEffect(() => {
        sessionStorage.setItem('user_refresh_token', refreshTokenValue ?? '');
    }, [refreshTokenValue])

    useEffect(() => {
        if (accessTokenValue && refreshTokenValue) {
            setIsLogin(true);
        }
    }, [accessTokenValue, refreshTokenValue])

    useEffect(() => {
        if (accessTokenValue && refreshTokenValue && window.parent) {
            console.log(window.location);
            window.parent.postMessage({
                request: 'user-login-success',
                message: 'User logins successfully',
                app_url: `${window.location.protocol}//${window.location.host}`
            }, '*');
        }
    }, [accessTokenValue, refreshTokenValue])

    return (
        <div>
            <h1>Message Page</h1>
            <p>This is the message page.</p>
            {
                isLogin ?
                    <div className="text-green-500">
                        You login at session
                    </div>
                    :
                    <div className="text-green-500">
                        You do not login at session
                    </div>
            }
            {
                messages.map((v, i) => {
                    return <div key={i}>{v}</div>
                })
            }
        </div>
    );
};

export default Message;
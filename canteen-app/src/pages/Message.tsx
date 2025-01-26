import React, { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Message: React.FC = () => {
    const [searchParams] = useSearchParams();
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
                    sessionStorage.setItem('user-access-token', ev.data.accessToken);
                    sessionStorage.setItem('user-refresh-token', ev.data.refreshToken);
                }
                else if (ev.data.request === 'logout') {
                    message = 'delete tokens successfully';
                    sessionStorage.removeItem('user-access-token');
                    sessionStorage.removeItem('user-refresh-token');
                }
                else if (ev.data.request === 'clear-localstorage') {
                    message = 'clear localstorage successfully';
                    localStorage.clear();
                }
                if (message !== '') {
                    console.log(message);
                }
            }
        }
    }, [])

    useEffect(() => {
        sessionStorage.setItem('cloud77_user_access_token', accessTokenValue ?? '');
    }, [accessTokenValue])

    useEffect(() => {
        sessionStorage.setItem('cloud77_user_refresh_token', refreshTokenValue ?? '');
    }, [refreshTokenValue])

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
                accessTokenValue && refreshTokenValue ?
                    <div className="text-green-500">
                        You login at session
                    </div>
                    :
                    <div className="text-green-500">
                        You do not login at session
                    </div>
            }
        </div>
    );
};

export default Message;
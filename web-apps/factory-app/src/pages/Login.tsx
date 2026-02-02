import React, { RefObject, useEffect, useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';

import * as models from '../models/storage'
import { getGateway, getToken } from '../models/service';

function getKey(): Promise<string> {

    if (models.getKey()) {
        return Promise.resolve(models.getKey());
    }

    return getGateway();
}

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [key, setKey] = useState('');
    const ssoRef: RefObject<HTMLIFrameElement> = React.createRef();

    const handleLogin = () => {
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);

        getKey().then(key => {
            console.log(key);
        });

        if (email && password) {
            getToken({ email, password })
        }

        // setInterval(() => {

        //     if (sessionStorage.getItem('sso_message_loaded')) {
        //         ssoRef.current?.contentWindow?.postMessage({
        //             name: "request_login",
        //             host: window.location.host,
        //             message: `${window.location.protocol}//${window.location.host}/message`,
        //             url: window.location.href,
        //         }, '*');
        //         sessionStorage.removeItem('sso_message_loaded');
        //     }

        // }, 300);
    };

    const handleSSOLogin = () => {
        // Handle SSO login logic here
        console.log('SSO Login');

    };

    useEffect(() => {
        if (sessionStorage.getItem('user_access_token')) {
            setToken(sessionStorage.getItem('user_access_token') || '');
            setEmail('xxxxxx');
            setPassword('xxxxxx');
        }

        getKey().then(key => {
            setKey(key);
        });

        window.addEventListener('message', (event) => {
            console.log(event.data);
            if (event.data.name === 'sso_message_loaded') {
                console.log('SSO message component loaded');
                sessionStorage.setItem('sso_message_loaded', 'true');
            }
            if (event.data.name === 'login_ready' && localStorage.getItem('sso_url')) {
                window.location.href = localStorage.getItem('sso_url') || '';
            }
        });
    }, [])

    // useEffect(() => {
    //     axios.get('api/gateway', {
    //         headers: {
    //             'x-api-version': 'v1'
    //         }
    //     })
    //         .then(response => {
    //             console.log(response.data);
    //             const data = response.data;
    //             console.log(data)
    //             localStorage.setItem('sso_url', data.sso);
    //             localStorage.setItem('home_url', data.home);
    //             localStorage.setItem('api_key', data.key);
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });
    // }, []);

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>
                Login
            </Typography>
            <form noValidate autoComplete="off">
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogin}
                >
                    Login
                </Button>
                <hr />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSSOLogin}
                >
                    SSO Login
                </Button>
            </form>

            <input title='key' type='text' value={key} style={{width:'100%'}} onChange={e => {
                setKey(e.target.value);
                models.updateKey(e.target.value);
            }}></input>
            <textarea title='token' value={token} style={{width:'100%',minHeight:'240px'}} onChange={(e) => {
                setToken(e.target.value);
                sessionStorage.setItem('user_access_token', e.target.value);
            }}></textarea>
            <iframe ref={ssoRef} title='SSO' src="https://www.cloud77.top/sso/message" width="100%" height="300px"></iframe>
        </Container>
    );
};

export default Login;
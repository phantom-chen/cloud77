import { Alert, Avatar, Button, Grid, Snackbar } from "@mui/material";
import { LoginDialog, SimpleChart } from "../components";
import { deepOrange, deepPurple, grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { getToken } from "../services/gateway";

interface Dictionary<T> {
    [key: string]: T
}

const Testers: Dictionary<string> = {
    'test1': "test 1",
    'test2': "test 2",
}

export default function Home() {
    const [open, setOpen] = useState<boolean>(false);
    const [isLogin, setIsLogin] = useState(true);
    
    useEffect(() => {
        // setIsLogin(localStorage.getItem('accessToken') && localStorage.getItem('refreshToken') ? true : false);
    }, [])

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <SimpleChart />
                </Grid>
                <Grid item xs={4}>
                    <pre style={{
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        color: 'white',
                        tabSize: 4,
                        background: 'black',
                        padding: '20px',
                        fontFamily: 'Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace'

                    }}>
                        <code>function cool(x)</code>
                    </pre>
                </Grid>
            </Grid>
            <Alert variant="outlined" severity="info">
                This is an info alert — check it out!
            </Alert>

            <Button onClick={() => {
                console.log(Testers['test1'])
                console.log(Testers['test2'])
                console.log(Testers['test3'])
                Testers['test4'] = 'test 4';
                console.log(Testers);
                console.log(Object.keys(Testers));

                delete Testers['test1'];
                const visitors = new Array<string>();
                visitors[0] = 'visitor 1';
                console.log(visitors);

                visitors.slice();

                console.log(Object.keys(Testers));
                
                const managers: Record<number, string> = {};
                managers[0] = "M 1";
                managers[2] = "M 2";
                console.log(managers);

                const dictionary: { [key: string]: string } = {};
                dictionary.firstName = 'Gapur'; // Works
                dictionary.lastName = 'Kassym'; // Works
            }}>
                Dictionary
            </Button>

            <Button variant="outlined" onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} snackbar</Button>
            <Button variant="outlined" onClick={() => {
                console.log(document.location.origin);
                console.log(document.location.href);
                console.log(btoa(document.location.origin));
                
                const href = `${localStorage.getItem('home') || ''}/login?origin=${btoa(document.location.origin)}&href=${btoa(document.location.href)}`;
                // document.location.href = href;
            }}>Cloud77 Login</Button>
            <Button variant="outlined" onClick={() => {
                var n = new Notification("hi", {
                    icon: 'logo192.png',
                    body: 'first notification'
                }); // not work in incognito mode
                console.log(window.Notification.permission);
                console.log(Notification.permission);
            }}>Push Notification</Button>

            <Button onClick={() => {
                fetch('/json/users/1').then(res => {
                    res.text().then(value => console.log(value));
                });
            }}>Get Users (Json placeholder)</Button>
            <Button onClick={() => {
                fetch('/json/todos/1').then(res => {
                    res.text().then(value => console.log(value));
                });
            }}>Get Todos (Json placeholder)</Button>
            <Button onClick={() => {
                fetch('/hottopic/browse/topicList').then(res => {
                    res.json().then(value => console.log(value));
                })
            }}>Topic List</Button>

            <LoginDialog open={!isLogin} onClose={(e,p) => {
                localStorage.setItem('email', e);
                setIsLogin(!isLogin);
                getToken({ email: e, password: p });
            }} />

            <Snackbar
                open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                message="snackbar test"
                key={'test'}
            />
        </>
    )
}
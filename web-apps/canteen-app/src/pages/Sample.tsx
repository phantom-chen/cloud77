import { Box, Grid, Alert, Stack, Typography, Snackbar, Button, styled, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Item from "./components/Item";

interface Dictionary<T> {
    [key: string]: T
}

const Testers: Dictionary<string> = {
    'test1': "test 1",
    'test2': "test 2",
}

const Sample: React.FC = () => {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [barOpened, setBarOpenED] = useState(false);
    const [message, setMessage] = useState('hello world');

    useEffect(() => {
        console.log(location.pathname);
        console.log(location.search);
        console.log(searchParams.get('name'));
    }, [location, searchParams]);

    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Box>
                <Typography variant='h6' component='div'>Current path: {location.pathname}</Typography>
                <Button variant="contained" onClick={() => setBarOpenED(v => !v)}>
                    {
                        barOpened ? "hide snackbar" : "show snackbar"
                    }
                </Button>
                <Button variant="contained" color="secondary" onClick={() => {
                    try {
                        throw new Error("simulate error here")
                    } catch (err: any) {
                        setBarOpenED(true);
                        setMessage(err.message);
                        setTimeout(() => {
                            setBarOpenED(false)
                        }, 2000);
                    }
                }}>
                    simulate error
                </Button>
            </Box>

            <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Alert variant="outlined" severity="error">
                            an error alert — check it out!
                        </Alert>
                    </Grid>

                    <Grid item xs={3}>
                        <Alert variant="outlined" severity="warning">
                            a warning alert — check it out!
                        </Alert>
                    </Grid>

                    <Grid item xs={3}>
                        <Alert variant="outlined" severity="info">
                            an info alert — check it out!
                        </Alert>
                    </Grid>
                    <Grid item xs={3}>
                        <Alert variant="outlined" severity="success">
                            a success alert — check it out!
                        </Alert>
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Item>xs=6</Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>xs=6</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>xs=4</Item>
                    </Grid>
                    <Grid item xs={8}>
                        <Item>xs=8</Item>
                    </Grid>
                </Grid>
            </Box>

            <Box>
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
            </Box>

            <Box>
                <Button variant="outlined" onClick={() => {
                    var n = new Notification("hi", {
                        icon: 'logo192.png',
                        body: 'first notification'
                    }); // not work in incognito mode
                    console.log(window.Notification.permission);
                    console.log(Notification.permission);
                }}>Push Notification</Button>

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

                <Button variant="outlined" onClick={() => {
                    console.log(`${document.location.origin}/message`);
                    const href = `${document.location.origin}/login?message=${btoa(document.location.origin + '/message')}&href=${btoa(document.location.href)}`;
                    console.log(href);
                    // document.location.href = href;
                }}>SSO Login</Button>
            </Box>

            <Box>
                <button onClick={() => {
                    fetch('/hottopic/browse/topicList').then(res => {
                        res.json().then(value => console.log(value));
                    })
                }}>Topic List</button>

                <button onClick={() => {
                    fetch('/json/users').then(res => {
                        res.text().then(value => console.log(value));
                    });
                }}>Json (users)</button>
                <button onClick={() => {
                    fetch('/json/todos').then(res => {
                        res.text().then(value => console.log(value));
                    });
                }}>Json (todos)</button>

                <button onClick={() => {
                    fetch('/resources/site.json').then(res => {
                        console.log(res);
                        // res.ok
                        // res.status 504 or 200
                        // res.statusText OK or Gateway Timeout
                        res.text().then(value => {
                            const obj = JSON.parse(value);
                            console.log(obj.amap);
                            if (!localStorage.getItem('cloud77_amap_value')) {
                                localStorage.setItem('cloud77_amap_value', obj.amap);
                            }
                            for (const installer of obj.installers) {
                                fetch(`/resources/installers/${installer}`, {
                                }).then(res => {
                                    res.text().then(value => {
                                        const version = value.split(' ')[1].split('-')[1];
                                        console.log(`/resources/installers/${installer}-Installer-${version}.exe`);
                                    });
                                });
                            }
                        });
                    }, err => {
                        console.log(err)
                    });
                }}>Site</button>
            </Box>
            <Snackbar
                open={barOpened}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={2000}
                message={message}
                key={'sample-snackbar'}
            />
        </Stack>
    )
}

export default Sample;
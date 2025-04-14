import { Box, Grid, Alert, Stack, Typography, Snackbar, Button, styled, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Item from "./components/Item";

const Sample: React.FC = () => {

    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [barOpened, setBarOpenED] = useState(false);
    const [message, setMessage] = useState('hello world');

    useEffect(() => {
        console.log(location.search);
        console.log(searchParams.get('name'));
    }, [location, searchParams]);

    return (
        <Stack sx={{ width: '100%' }} spacing={2}>
            <Typography variant='h6' component='div'>Current path: {location.pathname}</Typography>
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

            <Button onClick={() => setBarOpenED(v => !v)}>
                {
                    barOpened ? "hide snackbar" : "show snackbar"
                }
            </Button>
            <Button onClick={() => {
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
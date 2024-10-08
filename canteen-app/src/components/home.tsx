import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { MapPage } from './AMap';

export default function Home() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('hello world');
    const [mapLicense, setMapLicense] = useState('');
    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (localStorage.getItem('akey')) {
            setMapLicense(localStorage.getItem('akey') || '');
        }
    }, [])

    useEffect(() => {
        console.log(location.search);
        console.log(searchParams.get('name'));
    }, [open, location, searchParams]);

    return (
        <>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Typography variant='h6' component='div'>Current path: {location.pathname}</Typography>
                <TextField label="Your map key" variant="standard" value={mapLicense} />


                <div>
                    <Button onClick={() => setOpen(v => !v)}>
                        {
                            open ? "hide snackbar" : "show snackbar"
                        }

                    </Button>
                    <Button onClick={() => {
                        try {
                            throw new Error("simulate error here")
                        } catch (err: any) {
                            setOpen(true);
                            setMessage(err.message);
                            setTimeout(() => {
                                setOpen(false)
                            }, 2000);
                        }
                    }}>
                        simulate error
                    </Button>
                </div>

                <Snackbar
                    open={open}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    autoHideDuration={2000}
                    message={message}
                    key={'test'}
                />
            </Stack>
            <Box sx={{ flexGrow: 1 }}>
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
            </Box>
            <MapPage />
        </>
    );
}

import React from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Account: React.FC = () => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Account Settings
                </Typography>
                <TextField
                    fullWidth
                    label="Username"
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    variant="outlined"
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                    Save Changes
                </Button>
            </Box>
        </Container>
    );
};

export default Account;
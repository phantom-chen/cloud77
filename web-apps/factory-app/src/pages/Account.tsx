import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Chip, Avatar } from '@mui/material';
import { Profile, UserAccount } from '@phantom-chen/cloud77';
import { deepOrange, deepPurple, grey } from "@mui/material/colors";
import { getAccount, getRole, TesterAccount } from '../models/service';

function UserProfile(props: { profile: Profile }) {
    const { profile } = props;

    return (
        <div>
            <TextField label="Surname" value={profile.surname} variant="outlined" />
            <TextField label="Surname" value={profile.givenName} variant="outlined" />
            <TextField label="Surname" value={profile.company} variant="outlined" />
            <TextField label="Surname" value={profile.companyType} variant="outlined" />
            <TextField label="Surname" value={profile.title} variant="outlined" />
            <TextField label="Surname" value={profile.city} variant="outlined" />
        </div>
    )
}

const Account: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<string>('tester');
    const [account, setAccount] = useState<UserAccount | undefined>(TesterAccount);

    return (
        <div style={{ display: 'flex' }}>
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
                    <Button sx={{ mt: 2 }} onClick={() => {
                        getRole().then(role => {
                            setRole(role);
                            if (role) {
                                getAccount(sessionStorage.getItem('user_email') ?? '')
                                .then(account => {
                                    setAccount(account);
                                })
                            }
                        })
                    }}>Load account</Button>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </Box>
            </Container>

            <Container>
                <TextField sx={{ minWidth: '300px', marginTop: '10px' }} disabled label="Email" value={account?.email || ''} variant="outlined" />
                <Avatar sx={{ bgcolor: deepPurple[500] }}>{account?.email.slice(0, 1)}</Avatar>
                <Chip label={role} variant="outlined" />
                <Chip label={account?.confirmed ? "confirmed" : "unconfirmed"} />
                <div style={{ marginTop: '20px' }}>
                    {
                        account?.profile ? <UserProfile profile={account.profile} /> : <div>No Profile</div>
                    }
                </div>

            </Container>
        </div>
    );
};

export default Account;
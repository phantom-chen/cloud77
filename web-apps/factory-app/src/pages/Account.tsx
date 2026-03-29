import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField, Button, Box, Chip, Avatar } from '@mui/material';
import { Profile, UserAccount } from '@phantom-chen/cloud77';
import { deepOrange, deepPurple, grey } from "@mui/material/colors";
import { getAccount, getRole, TesterAccount } from '../models/service';

function UserProfile(props: { profile: Profile }) {
    const { profile } = props;

    return (
        <>
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.surname} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.givenName} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.company} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.companyType} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.title} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.city} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.phone} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.contact} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.supplier} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.fax || ''} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.post || ''} variant="outlined" />
            <TextField sx={{ minWidth: '500px', marginTop: '8px' }} label="Surname" value={profile.address || ''} variant="outlined" />

            <Box sx={{ mt: 2 }}>
                {/* <Button variant="contained">Save</Button> */}
                <Button variant="contained" color="primary">
                    Action 2
                </Button>
            </Box>
        </>
    )
}

const Account: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<string>('');
    const [account, setAccount] = useState<UserAccount | undefined>(TesterAccount);

    useEffect(() => {
        getRole().then(role => {
            setRole(role);
            if (role) {
                setEmail(sessionStorage.getItem('user_email') ?? '');
                getAccount(sessionStorage.getItem('user_email') ?? '')
                    .then(account => {
                        setAccount(account);
                    })
            }
        })
    }, [])

    return (
        <div style={{ display: 'flex' }}>
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4">Account</Typography>
                    <TextField sx={{ minWidth: '300px', marginTop: '10px' }} disabled label="Email" value={email} variant="outlined" />
                    <Box>
                        <Avatar sx={{ bgcolor: deepPurple[500] }}>{account?.email.slice(0, 1)}</Avatar>
                    </Box>
                    <Box>
                        <Chip label={role} variant="outlined" />
                    </Box>
                    <Box>
                        <Chip label={account?.confirmed ? "confirmed" : "unconfirmed"} />
                    </Box>
                </Box>

                <Button sx={{ mt: 2 }} onClick={() => {
                }}>Action 1</Button>

            </Container>

            <Container>
                <Typography variant="h4">Profile</Typography>
                <Box style={{ marginTop: '10px' }}>
                    {
                        account?.profile ? <UserProfile profile={account.profile} /> : <div>No Profile</div>
                    }
                </Box>

            </Container>
        </div>
    );
};

export default Account;
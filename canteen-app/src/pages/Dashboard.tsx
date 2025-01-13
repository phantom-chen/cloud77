import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Stack, Grid, styled, Paper } from '@mui/material';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { PVData, UVData } from './data';
import { Line, LineChart, ResponsiveContainer, BarChart, Bar, XAxis } from "recharts";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ width: '100%', maxWidth: 240, bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard')}>
                                <ListItemIcon>
                                    <DraftsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Graph" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Map" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard')}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary="Products" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </nav>
                <Divider />
                <nav aria-label="secondary mailbox folders">
                    <List>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard/tabs')}>
                                <ListItemText primary="Tabs" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard/timeline')}>
                                <ListItemText primary="Timeline" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component="a" onClick={() => navigate('/dashboard/images')}>
                                <ListItemText primary="Images" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component="a" onClick={() => navigate('/dashboard/#images')}>
                                <ListItemText primary="Images" />
                            </ListItemButton>
                        </ListItem>

                    </List>
                </nav>
            </Box>
            <div style={{ 'flex': '1 1 auto' }}>
                <Stack sx={{ width: '100%' }} spacing={2}>
                    <h1>Dashboard</h1>
                    <p>Welcome to the Dashboard!</p>
                    <div style={{
                        height: '95px',
                        padding: '5px 15px 0 15px'
                    }}>
                        <ResponsiveContainer>
                            <LineChart data={PVData}>
                                <Line
                                    type="monotone"
                                    dataKey="pv"
                                    stroke="#8884d8"
                                    strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "95%",
                        height: 85
                    }}>
                        <ResponsiveContainer>
                            <BarChart data={UVData}>
                                <Bar dataKey="uv" fill={'pink'} />
                                <XAxis dataKey="name" stroke="none" tick={{ fill: 'white' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

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
                </Stack>
            </div>
        </div>
    );
};

export default Dashboard;
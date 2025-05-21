import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Stack, Grid, styled, Paper } from '@mui/material';
import React, { Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import { Charts } from './components/Charts';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';

const BasicTimeline = React.lazy(() => import("./components/TimeLine"));
const ImageMasonry = React.lazy(() => import("./components/ImageMasonry"));

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

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
                                    <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="Map" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/dashboard')}>
                                <ListItemIcon>
                                    <ExpandMore />
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
                    <Suspense>
                        <Routes>
                            <Route path='' element={<Charts />} />
                            <Route path='/timeline' element={<BasicTimeline />} />
                            <Route path='/images' element={<ImageMasonry />} />
                        </Routes>
                    </Suspense>
                </Stack>
            </div>
        </div>
    );
};

export default Dashboard;
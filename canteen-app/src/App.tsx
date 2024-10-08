"use client";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import React, { Suspense, useEffect, useState } from "react";
import { AppBar, Badge, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { AddBoxOutlined, MenuOutlined, AccountCircle, ArrowBackOutlined, Notifications, MailOutline } from '@mui/icons-material';
import { BasicList } from "./components/basic-list";

process.env.DEMO_USER = "hello";
console.log(process.env);

const UnderConstruction = React.lazy(() => import('./pages/UnderBuild'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const DiagramPage = React.lazy(() => import('./pages/Diagram'));
const MessagePage = React.lazy(() => import('./pages/Message'));

function App() {

  const navigate = useNavigate();
  const location = useLocation();
  const [appbarVisible, setAppbarVisible] = useState(true);
  const [isDashboard, setIsDashboard] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuOpened, setMenuOpened] = useState(true);

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setAuth(event.target.checked);
  // };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hanleLogout = () => {
    setAnchorEl(null);
    sessionStorage.clear();
    navigate('');
  }
  
  useEffect(() => {
    if (location.pathname.startsWith('/login') || location.pathname.startsWith('/message')) {
      setAppbarVisible(false);
    } else {
      setAppbarVisible(true);
    }
    if (location.pathname.startsWith('/dashboard')) {
      setIsDashboard(true);
    } else {
      setIsDashboard(false);
    }
  }, [location.pathname]);

  return (    
    <ErrorBoundary fallback={<div>Something went wrong</div>}>

      <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>

        <AppBar position="static" style={{ display: appbarVisible ? 'block' : 'none' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => navigate('')}
            >
              <AddBoxOutlined />
            </IconButton>

            {
              isDashboard ? <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                sx={{ mr: 2 }}
                onClick={() => setMenuOpened(!menuOpened)}
              >
                <MenuOutlined />
              </IconButton> : null
            }

            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Canteen App
            </Typography>

            <Button sx={{ color: '#fff' }} onClick={() => navigate("dashboard")}>
              Dashboard
            </Button>
            <Button sx={{ color: '#fff' }} onClick={() => navigate("diagram")}>
              Diagram
            </Button>
            {
              isDashboard ? <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={handleMenu}
              >
                <AccountCircle />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, marginLeft: '10px' }}>
                  demo
                </Typography>
              </IconButton> : null
            }

            {
              isDashboard ? <IconButton>
                <ArrowBackOutlined />
              </IconButton> : null
            }

            {
              isDashboard ? <IconButton>
                <Badge badgeContent='3' color="warning">
                  <Notifications />
                </Badge>
              </IconButton> : null
            }

            {
              isDashboard ? <IconButton>
                <Badge badgeContent='3' color="secondary">
                  <MailOutline />
                </Badge>
              </IconButton> : null
            }

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              <MenuItem>Tabs</MenuItem>
              <MenuItem>Timeline</MenuItem>
              <MenuItem>Images</MenuItem>
              <MenuItem onClick={hanleLogout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <div style={{ flex: '1 1 auto' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            { isDashboard && menuOpened ? <BasicList /> : null}
            <div style={{flex: '1 1 auto'}}>
              <Suspense>
                <Routes>
                  <Route path='' element={<UnderConstruction />} />
                  <Route path='message' element={<MessagePage />} />
                  <Route path='diagram' element={<DiagramPage />} />
                  <Route path='dashboard/*' element={<DashboardPage />} />
                </Routes>
              </Suspense>
            </div>
          </div>

        </div>
      </div>

    </ErrorBoundary>
  );
}

export default App;

import React, { useEffect, Suspense, useCallback } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

// import 'ag-grid-community/styles//ag-grid.css';
// import 'ag-grid-community/styles//ag-theme-alpine.css';
import './styles/ag-grid.css';
import './styles/ag-theme-alpine.css';
import { getGatewayApp } from './services/gateway';

const HomePage = React.lazy(() => import('./pages/home'));
const LoginPage = React.lazy(() => import('./pages/login'));
const UserPage = React.lazy(() => import('./pages/user'));
const ManagerPage = React.lazy(() => import('./pages/manager'));
const DashboardPage = React.lazy(() => import('./pages/dashboard'));

const DiagramPage = React.lazy(() => import('./pages/diagram'));
const ChatPage = React.lazy(() => import('./pages/chat'));
const MessagePage = React.lazy(() => import('./pages/message'));
const UsersPage = React.lazy(() => import('./pages/users'));

const Items: { label: string, link: string, divider?: boolean }[] = [
  { label: 'Home', link: ''},
  { label: 'Login', link: '/login'},
  { label: 'Diagram', link: '/diagram'},
  { label: 'Chat', link: '/chat'},
  { label: "", link: "", divider: true },
  { label: 'Author', link: '/authors'},
  { label: 'Bookmark', link: '/bookmarks'},
  { label: "", link: "", divider: true },
  { label: 'Dashboard', link: '/dashboard'},
  { label: 'Users', link: '/users'},
  { label: 'Licenses', link: '/licenses'},
  { label: "", link: "", divider: true },
  { label: 'Test', link: '/test'},
]

function App() {
  // const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    console.log(document.location);
    console.log(document.location.href);
    console.log(btoa(document.location.href));
  }, [location]);

  useEffect(() => {
    getGatewayApp().then(res => {
      console.log(res);
    })
  }, [])

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* <nav>
          <List style={{ width: '240px', border: '1px solid rgb(224, 224, 224)' }}>
            {
              Items.map((v,i) => {
                if (v.divider) {
                  return <Divider key={i} />
                } else {
                  return <ListItem key={i}>
                  <ListItemButton selected={v.link === location.pathname}>
                    <ListItemText primary={v.label} onClick={() => navigate(v.link)} />
                  </ListItemButton>
                </ListItem>
                }
              })
            }
          </List>
        </nav> */}

        <Suspense fallback={<div>Loading...</div>}>
          <div style={{ flex: '1 1 auto' }}>
            <Routes>
              <Route path='' element={<HomePage />} />
              <Route path='login' element={<LoginPage />} />
              <Route path='user' element={<UserPage />} />
              <Route path='manager' element={<ManagerPage />} />
              <Route path='users' element={<UsersPage />} />
              <Route path='users/:email' element={<UserPage />} />
              <Route path='dashboard' element={<DashboardPage />} />
              <Route path='chat' element={<ChatPage />} />
              <Route path='message' element={<MessagePage />} />
              <Route path='diagram' element={<DiagramPage />} />
            </Routes>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

export default App;

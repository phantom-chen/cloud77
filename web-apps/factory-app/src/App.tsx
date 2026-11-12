"use client";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import './App.css';

import React, { Suspense, useEffect, useState } from "react";
import DiagramPage from './pages/Diagram';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import AccountPage from './pages/Account';
import ChatPage from './pages/Chat';
import MessagePage from './pages/Message';
import AccountsPage from './pages/Accounts'
import NotFound from './pages/NotFound';
import AccountSettings from './pages/AccountSettings';
import AppBar from './components/AppBar';

// process.env.DEMO_USER = "hello";
// console.log(process.env);

ModuleRegistry.registerModules([AllCommunityModule]);

const items = [
    { label: 'Home', href: '/', color: 'white' },
    { label: 'SSO & Login', href: '/login', color: 'white' },
    { label: 'Account', href: '/account', color: 'white' },
    { label: 'Accounts', href: '/accounts', color: 'white' },
    { label: 'Diagram', href: '/diagram', color: 'white' },
    { label: 'Chat', href: '/chat', color: 'white' },
    { label: 'Settings', href: '/settings', color: 'white' },
    { label: 'Posts', href: '/posts', color: 'white' },
    { label: 'Tasks', href: '/tasks', color: 'white' },
    { label: 'Files', href: '/files', color: 'white' },
    { label: 'History', href: '/history', color: 'white' },
];

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(sessionStorage.getItem('user') || '');
    const [appBarItems, setAppBarItems] = useState(items);

    const hanleLogout = () => {
        sessionStorage.clear();
        navigate('');
    }

    useEffect(() => {
        setAppBarItems(items => {
            const activeItem = items.find(item => location.pathname.split('/')[1] === item.href.split('/')[1]);

            if (activeItem) {
                activeItem.color = '#00ff00';
            }
            return [...items];
        });
    }, [location.pathname]);

    return (
        <>
            <AppBar items={appBarItems} />
            <Routes>
                <Route path="" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/message" element={<MessagePage />} />

                <Route path="/account" element={<AccountPage />} />
                <Route path="/account/settings" element={<AccountSettings />} />
                {/* setting page */}
                <Route path="/diagram" element={<DiagramPage />} />
                <Route path="/chat" element={<ChatPage />} />
                {/* history page */}
                {/* posts page */}
                {/* tasks page */}
                {/* files page */}

                {/* dashboard page */}
                <Route path="/accounts/:email" element={<AccountPage />} />
                <Route path="/accounts" element={<AccountsPage />} />

                {/* not found page */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;

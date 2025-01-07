"use client";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import React, { Suspense, useEffect, useState } from "react";
import DiagramPage from './pages/Diagram';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import AccountPage from './pages/Account';
import ChatPage from './pages/Chat';

process.env.DEMO_USER = "hello";
console.log(process.env);

function App() {

    const navigate = useNavigate();
    const location = useLocation();

    const hanleLogout = () => {
        sessionStorage.clear();
        navigate('');
    }

    useEffect(() => {
        console.log(location);
    }, [location]);

    return (
        <>
            <nav>
                <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0, backgroundColor: '#333' }}>
                    <li style={{ margin: '0 10px' }}>
                        <a href="/" style={{ color: location.pathname === '/login' ? 'yellow' : 'white', textDecoration: 'none', padding: '10px 20px', display: 'block' }} onMouseEnter={(e) => e.currentTarget.style.color = 'yellow'} onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === '/login' ? 'yellow' : 'white'}>Home</a>
                    </li>
                    <li style={{ margin: '0 10px' }}>
                        <a href="/login" style={{ color: location.pathname === '/login' ? 'yellow' : 'white', textDecoration: 'none', padding: '10px 20px', display: 'block' }} onMouseEnter={(e) => e.currentTarget.style.color = 'yellow'} onMouseLeave={(e) => e.currentTarget.style.color = location.pathname === '/login' ? 'yellow' : 'white'}>Login</a>
                    </li>
                    <li style={{ margin: '0 10px' }}>
                        <a href="/account" style={{ color: 'white', textDecoration: 'none', padding: '10px 20px', display: 'block' }}>Account</a>
                    </li>
                    <li style={{ margin: '0 10px' }}>
                        <a href="/diagram" style={{ color: 'white', textDecoration: 'none', padding: '10px 20px', display: 'block' }}>Diagram</a>
                    </li>
                    <li style={{ margin: '0 10px' }}>
                        <a href="/chat" style={{ color: 'white', textDecoration: 'none', padding: '10px 20px', display: 'block' }}>Chat</a>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/diagram" element={<DiagramPage />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </>
    );
}

export default App;

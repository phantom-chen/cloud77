"use client";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import React, { Suspense, useEffect, useState } from "react";

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
        <p>Factory App WIP</p>
    );
}

export default App;

"use client";
import { ErrorBoundary } from "react-error-boundary";
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
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <p>Canteen App WIP</p>
        </ErrorBoundary>
    );
}

export default App;

"use client";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import React, { Suspense, useEffect, useState } from "react";

import HomePage from './pages/Home';
import DashboardPage from './pages/Dashboard';
import GraphPage from './pages/Graph';
import CompanyPage from './pages/Company';
import MapPage from './pages/Map';
import MessagePage from './pages/Message';

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
            <nav>
                <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/dashboard">Dashboard</a>
                    </li>
                    <li>
                        <a href="/graph">Graph</a>
                    </li>
                    <li>
                        <a href="/map">Map</a>
                    </li>
                    <li>
                        <a href="/company">Company</a>
                    </li>
                    <li>
                        <a href="/message">Message</a>
                    </li>
                </ul>
            </nav>
            <p>Canteen App WIP</p>
            <div className="UnderConstruction-social-networks">
                <a className="UnderConstruction-social-networks-link">
                    <img
                        className="UnderConstruction-social-networks-image"
                        alt="hello"
                        src="assets/facebook_16x16.png"></img>
                </a>
                <a className="UnderConstruction-social-networks-link">
                    <img
                        className="UnderConstruction-social-networks-image"
                        alt="hello"
                        src="assets/twitter_16x16.png"></img>
                </a>
                <a className="UnderConstruction-social-networks-link">
                    <img
                        className="UnderConstruction-social-networks-image"
                        alt="hello"
                        src="assets/linkedin_16x16.png"></img>
                </a>
                <a className="UnderConstruction-social-networks-link">
                    <img
                        className="UnderConstruction-social-networks-image"
                        alt="hello"
                        src="assets/emailto_16x16.png"></img>
                </a>
            </div>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/graph" element={<GraphPage />} />
                <Route path="/message" element={<MessagePage />} />
            </Routes>
        </ErrorBoundary>
    );
}

export default App;

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
import LiveDataPage from './pages/LiveData';
import SamplePage from './pages/Sample';

process.env.DEMO_USER = "hello";
console.log(process.env);

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const [navVisible, setNavVisible] = useState<boolean>(true);

    const hanleLogout = () => {
        sessionStorage.clear();
        navigate('');
    }

    useEffect(() => {
        console.log(location.pathname);
        if (location.pathname.startsWith('/dashboard')
            || location.pathname.startsWith('/message')) {
            setNavVisible(false);
        }
        else {
            setNavVisible(true);
        }
    }, [location.pathname]);

    return (
        <>
            {
                navVisible
                    ? <nav>
                        <ul style={{ display: 'flex', listStyleType: 'none', padding: 0 }}>
                            <li>
                                <a href="/">Home</a>
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
                                <a href="/dashboard">Dashboard</a>
                            </li>
                            <li>
                                <a href="/message">Message</a>
                            </li>
                            <li>
                                <a href="/live-data">Live Data</a>
                            </li>
                            <li>
                                <a href="/sample">Sample</a>
                            </li>
                        </ul>
                    </nav>
                    : undefined
            }
            {
                navVisible
                    ? <div className="UnderConstruction-social-networks">
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
                    : undefined
            }
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard/*" element={<DashboardPage />} />
                    <Route path="/company" element={<CompanyPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/graph" element={<GraphPage />} />
                    <Route path="/message" element={<MessagePage />} />
                    <Route path="/live-data" element={<LiveDataPage />} />
                    <Route path="/sample" element={<SamplePage />} />
                </Routes>
            </ErrorBoundary>
        </>
    );
}

export default App;

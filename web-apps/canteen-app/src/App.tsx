"use client";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import React, { Suspense, useEffect, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";

const HomePage = React.lazy(() => import('./pages/Home'));
const LoginPage = React.lazy(() => import('./pages/Login'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard'));
const GraphPage = React.lazy(() => import('./pages/Graph'));
const CompanyPage = React.lazy(() => import('./pages/Company'));
const MapPage = React.lazy(() => import('./pages/Map'));
const MessagePage = React.lazy(() => import('./pages/Message'));
const LiveDataPage = React.lazy(() => import('./pages/LiveData'));
const SamplePage = React.lazy(() => import('./pages/Sample'));
const DiagramPage = React.lazy(() => import('./pages/Diagram'));
const LayoutPage = React.lazy(() => import('./pages/Layout'));
const FilesPage = React.lazy(() => import('./pages/Files'));
const NotFoundPage = React.lazy(() => import('./pages/NotFound'));

// process.env.DEMO_USER = "hello";
// console.log(process.env);

function App() {

    const navigate = useNavigate();
    const location = useLocation();
    const [navVisible, setNavVisible] = useState<boolean>(true);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('');
    }

    useEffect(() => {
        console.log(location.pathname);
        if (location.pathname.startsWith('/dashboard')
            || location.pathname.startsWith('/layout')
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
                navVisible ? <Header /> : undefined
            }
            {
                navVisible ? <Footer /> : undefined
            }
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/dashboard/*" element={<DashboardPage />} />
                        <Route path="/company" element={<CompanyPage />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/graph" element={<GraphPage />} />
                        <Route path="/message" element={<MessagePage />} />
                        <Route path="/live-data" element={<LiveDataPage />} />
                        <Route path="/sample" element={<SamplePage />} />
                        <Route path="/layout" element={<LayoutPage />} />
                        <Route path="/diagram" element={<DiagramPage />} />
                        <Route path="/files" element={<FilesPage />} />
                        <Route path="*" Component={NotFoundPage} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </>
    );
}

export default App;

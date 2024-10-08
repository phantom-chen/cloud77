import { Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("../components/home"));
const BasicTabs = React.lazy(() => import("../components/basic-tabs"));
const BasicTimeline = React.lazy(() => import("../components/basic-timeline"));
const ImageMasonry = React.lazy(() => import("../components/image-masonry"));

export default function Dashboard() {

    return (
        <div className="login-page" style={{ margin: "0px" }}>
            <Suspense>
                <Routes>
                    <Route path="/tabs" element={<BasicTabs />} />
                    <Route path="/timeline" element={<BasicTimeline />} />
                    <Route path="/images" element={<ImageMasonry />} />
                    <Route path="" element={<Home />} />
                </Routes>
            </Suspense>
        </div>
    )
}

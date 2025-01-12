import React, { useEffect, useRef, useState } from 'react';
import { useMap, useMapContext, APILoader, Provider, Map, ScaleControl, ToolBarControl, ControlBarControl, HawkEyeControl } from '@uiw/react-amap';

const mapStyle = 'amap://styles/d6c788ccbba78e3ccf5c0aa03518d264';
const center = [120.154715, 30.264667]; // [116.397428, 39.90923]

const MapPage: React.FC = () => {
    const [zoom, setZoom] = useState<number>(12);
    const [show, setShow] = useState<boolean>(true);
    const [key, setKey] = useState<string>('');

    useEffect(() => {
        if (localStorage.getItem('cloud77_amap_value')) {
            setKey(localStorage.getItem('cloud77_amap_value') || '');
        }
    }, [])

    return (
        <div>
            <h1>Map Page</h1>
            <p>This is the map page.</p>
            {
                key.length > 0
                    ? (
                        <div style={{ height: "600px", padding: "20px", boxShadow: '1px 1px 2px 2px lightgray' }}>
                            <APILoader akey={key}>
                                <Map>
                                    <>
                                        <ScaleControl
                                            visiable={show}
                                        />
                                        <ToolBarControl visiable={show} />
                                        <ControlBarControl
                                            visiable={show}
                                        />
                                        <HawkEyeControl
                                            visiable={show}
                                        />
                                    </>
                                </Map>
                            </APILoader>

                        </div>
                    )
                    : <p>You have no amap key</p>
            }
        </div>
    );
};

export default MapPage;
import React, { useEffect, useRef, useState } from 'react';
import { useMap, useMapContext, APILoader, Provider, Map, ScaleControl, ToolBarControl, ControlBarControl, HawkEyeControl, Geolocation } from '@uiw/react-amap';
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Stack, TextField } from '@mui/material';

const mapStyle = 'amap://styles/d6c788ccbba78e3ccf5c0aa03518d264';

const Centers = [
    { name: "beijing", point: [116.397428, 39.90923] },
    { name: "shanghai", point: [121.394147, 31.262488] },
    { name: "hangzhou", point: [120.15507, 30.274084] }
]


const MapPage: React.FC = () => {
    const [zoom, setZoom] = useState<number>(12);
    const [show, setShow] = useState<boolean>(true);
    const [center, setCenter] = useState<number[]>([]);
    const [key, setKey] = useState<string>('');
    const [location, setLocation] = React.useState(Centers[0].name);

    const handleChange = (event: SelectChangeEvent) => {
        setLocation(event.target.value as string);
    };

    useEffect(() => {
        if (localStorage.getItem('cloud77_amap_value')) {
            setKey(localStorage.getItem('cloud77_amap_value') || '');
        }
    }, [])

    useEffect(() => {
        const _c = Centers.find(c => c.name == location);
        if (_c) {
            setCenter(_c.point);
        }
    }, [location])

    return (
        <div>
            <Stack sx={{ width: '100%' }} spacing={2}>
                <h1>Map Page</h1>
                <TextField label="Your map key" variant="standard" component='div' value={key} />
            </Stack>
            {
                key.length > 0
                    ? (
                        <div style={{ height: "600px", padding: "20px", boxShadow: '1px 1px 2px 2px lightgray' }}>
                            <APILoader akey={key}>
                                <Map zoom={zoom} center={center} mapStyle={mapStyle}>
                                    <ScaleControl offset={[16, 30]} position="LB" />
                                    <ToolBarControl offset={[16, 10]} position="RB" />
                                    <ControlBarControl offset={[16, 180]} position="RB" />
                                    <Geolocation
                                        maximumAge={100000}
                                        borderRadius="5px"
                                        position="RB"
                                        offset={[16, 80]}
                                        zoomToAccuracy={true}
                                        showCircle={true}
                                    />
                                </Map>
                            </APILoader>

                        </div>
                    )
                    : <p>You have no amap key</p>
            }
            <div>
                <Slider min={5} max={15} defaultValue={zoom} onChange={(e, v) => {
                    setZoom(v as number);
                }} aria-label="Default" valueLabelDisplay="auto" />
                <Checkbox
                    checked={show}
                    onChange={e => setShow(!show)}
                    inputProps={{ 'aria-label': 'Scale' }}
                />
            </div>
            <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                    value={location}
                    label="Location"
                    onChange={handleChange}
                >
                    <MenuItem value={'beijing'}>BeiJing</MenuItem>
                    <MenuItem value={'shanghai'}>ShangHai</MenuItem>
                    <MenuItem value={'hangzhou'}>HangZhou</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default MapPage;
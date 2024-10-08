import React, { useRef, useEffect, useState } from 'react';
import { useMap, useMapContext, APILoader, Provider, Map, ScaleControl, ToolBarControl, ControlBarControl, HawkEyeControl } from '@uiw/react-amap';
import { Checkbox, FormControlLabel, FormGroup, Slider } from '@mui/material';

const mapStyle = 'amap://styles/d6c788ccbba78e3ccf5c0aa03518d264';
const center = [120.154715, 30.264667]; // [116.397428, 39.90923]
const zoom = 12;

// export function Cloud77Map() {
//   return (
//   <div style=>
//       <Map
//         // amapkey={AMAP_KEY}
//       >
//         <Marker position={center} />
//       </Map>
//     </div>
//   );
// }

const Marker = () => {
  const warpper = useRef(null);
  const { map, state } = useMapContext();
  const { setContainer } = useMap({
    container: warpper.current,
    center,
    zoom
  });

  useEffect(() => {
    if (map) {
      const marker = new AMap.Marker({
        icon: new AMap.Icon({
          imageSize: new AMap.Size(25, 34),
          image: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png'
        }),
        position: [116.405285,39.904989],
        offset: new AMap.Pixel(-13, -30)
      });
      // 创建点标记
      const marker1 = new AMap.Marker({
        position: new AMap.LngLat(116.32945,39.939772)
      });
      map.add(marker1);
      if (state.map) {
        marker.setMap(state.map);
      }
    }
  }, [map]);
  
  useEffect(() => {
    if (warpper.current) {
      setContainer(warpper.current);
    }
  }, [warpper.current]);

  return (
    <>
      <div ref={warpper} />
    </>
  );
}

export function MapPage() {

  const [zoom, setZoom] = useState<number>(12);
  const [show, setShow] = useState<boolean>(true);
  const [key, setKey] = useState<string>('');

  useEffect(() => {
    if (localStorage.getItem('akey')) {
      setKey(localStorage.getItem('akey') || '');
    }
  }, [])

  return (
    <div style={{ height: "600px", padding: "20px", boxShadow: '1px 1px 2px 2px lightgray' }}>
      <APILoader akey={key}>
        <Map zoom={zoom} center={center} mapStyle={mapStyle} viewMode='2D'>
          <>
            <ScaleControl
              visiable={show}
              offset={[60, 10]}
              position="RT"
            />
            <ToolBarControl visiable={show} offset={[10, 10]} position="RT" />
            <ControlBarControl
              visiable={show}
              offset={[30, 10]}
              position="RT"
            />
            <HawkEyeControl
              visiable={show}
              offset={[50, 10]}
            />
          </>
        </Map>
      </APILoader>
      <Slider min={5} max={15} defaultValue={zoom} onChange={(e,v) => {
        console.log(v);
        setZoom(v as number);
      }} aria-label="Default" valueLabelDisplay="auto" />
    <Checkbox
      checked={show}
      onChange={e => setShow(!show)}
      inputProps={{ 'aria-label': 'Scale' }}
    />
    </div>

  )
};

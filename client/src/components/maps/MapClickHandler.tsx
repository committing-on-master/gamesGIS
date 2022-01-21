import React from 'react';
import { useMapEvent } from 'react-leaflet';

function MapClickHandler() {
    const map = useMapEvent("click", (data) => {
        console.log(JSON.stringify(data.latlng, null, 4));
      })
    return (<></>);
}

export { MapClickHandler };

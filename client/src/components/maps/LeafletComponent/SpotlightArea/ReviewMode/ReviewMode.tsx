import { latLng } from 'leaflet';
import React from 'react';
import { Polygon } from 'react-leaflet';
import { useAppSelector } from '../../../../../store/hooks';
import { selectSpotlightArea } from '../../../../../store/markers/slice';

function ReviewMode() {
    const area = useAppSelector(state => selectSpotlightArea(state.markers));
    if (area) {
        const coordinatesArray = area.coordinates.map((value) => latLng(value.x, value.y));
        return <Polygon pathOptions={{ color: area.color }} positions={coordinatesArray} />;
    }
    return null;
}

export { ReviewMode };

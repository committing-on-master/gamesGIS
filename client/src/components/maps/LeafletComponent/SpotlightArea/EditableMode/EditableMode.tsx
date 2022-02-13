import { latLng } from 'leaflet';
import React from 'react';
import { Circle, Polygon, Polyline } from 'react-leaflet';
import { useAppSelector } from '../../../../../store/hooks';
import { selectEditableColor, selectEditableCoordinates } from '../../../../../store/markers/slice';

function EditableMode() {
    const coordinates = useAppSelector(state => selectEditableCoordinates(state.markers));
    const color = useAppSelector(state => selectEditableColor(state.markers));
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    if (coordinates.length === 1) {
        return <Circle center={[coordinates[0].x, coordinates[0].y]} radius={1} pathOptions={{ color: color }} />
    }

    if (coordinates.length === 2) {
        return <Polyline
            pathOptions={{ color: color }}
            positions={[
                [coordinates[0].x, coordinates[0].y],
                [coordinates[1].x, coordinates[1].y]
            ]}
        />
    }

    const coordinatesArray = coordinates.map((value) => latLng(value.x, value.y));
    return <Polygon pathOptions={{ color: color }} positions={coordinatesArray} />
}

export { EditableMode };

import { Circle, Polygon, Polyline } from "react-leaflet";
import { useAppSelector } from "../../store/hooks";
import { selectEditableColor, selectEditableCoordinates, selectIsEditingMode, selectMarkerById } from "../../store/markers/slice";
import { latLng } from "leaflet";

/**Костыль, чтобы не писать кастомный режим работы с Popup окошком leaflet-а */
function SpotlightArea() {
    const editableMode = useAppSelector(state => selectIsEditingMode(state.markers));
    if (editableMode) {
        return <SpotliteEditingArea />
    } else {
        return <SpotlightSavedArea />
    }
}


function SpotliteEditingArea() {
    const coordinates = useAppSelector(state => selectEditableCoordinates(state.markers));
    const color = useAppSelector(state => selectEditableColor(state.markers));
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    if (coordinates.length === 1) {
        return <Circle center={[coordinates[0].x, coordinates[0].y]} radius={3} pathOptions={{ color: color }} />
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
    return <Polygon pathOptions={{color: color}} positions={coordinatesArray} />
}

function SpotlightSavedArea() {
    return null;

    // return (
    //     <Polygon
    //         positions={marker.bound}
    //         color={marker.color} />
    // );
}

export { SpotlightArea };

import { Polygon } from "react-leaflet";
import { useAppSelector } from "../../store/hooks";
import { selectAreaById } from "../../store/areas/slice";
import { mapSelectors } from "../../store/map/state";

/**Костыль, чтобы не писать кастомный режим работы с Popup окошком leaflet-а */
export function SpotlightArea() {
    const markerId = useAppSelector(state => mapSelectors.spotlightAreaId(state.map));
    const marker = useAppSelector(state => selectAreaById(state.areas, markerId!));

    if (!markerId || !marker) {
        return (null);
    }

    return (
        <Polygon
            positions={marker.bound}
            color={marker.color} />
    );
}

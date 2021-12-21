import { TileLayer } from "react-leaflet";
import { MapType } from "../../api/dto/types/MapType";
import { useAppSelector } from "../../store/hooks";
import { mapSelectors } from "../../store/map/state";


interface MapLayerWrapperProps {
    mapHost: string;
    mapLayer: number;
}
function MapLayerWrapper(props: MapLayerWrapperProps) {
    const mapType = useAppSelector((state) => mapSelectors.name(state.map));
    const mapBound = useAppSelector((state) => mapSelectors.bounds(state.map));

    if (mapType === MapType.Undefined || !mapBound) {
        return (null);
    }
    
    const mapUrl = `http://${props.mapHost}/${mapType}/${props.mapLayer}/{z}/tile_{x}_{y}.png`;
    // const mapUrl = `http://develop.constantine.keenetic.name/maps/${props.mapName}/${props.mapLayer}/{z}/tile_{x}_{y}.png`;
    
    const leftBottom = mapBound[0];
    const rightTop = mapBound[1];

    return (
        <TileLayer
            url={mapUrl}
            // Coordinates in CRS.Simple take the form of [y, x] instead of [x, y], in the same way Leaflet uses [lat, lng] instead of [lng, lat]
            bounds= {[
                [leftBottom.x, leftBottom.y],
                [rightTop.x, rightTop.y]
            ]}
        />
    )
}

export { MapLayerWrapper }

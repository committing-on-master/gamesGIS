import { LeafletMouseEvent } from "leaflet";
import { TileLayer, useMapEvent } from "react-leaflet";
import { useAppSelector } from "../../store/hooks";
import { mapSelectors } from "../../store/mapProfile/state";
import { useEventHub } from "./EventHubProvider";


function MapLayerWrapper() {
    const mapParams = useAppSelector((state) => mapSelectors.layerParams(state.map));
    const mapLayer = useAppSelector((state) => mapSelectors.currentLayer(state.map));
    useMapEvent("click", (eventArg) => {
        eventHub.publish({x: eventArg.latlng.lat, y: eventArg.latlng.lng});
    })
    const eventHub = useEventHub();

    const mapHost = process.env.REACT_APP_TILES_URL || "localhost:3000/map"
    const mapUrl = `http://${mapHost}/${mapParams.map}/${mapLayer}/{z}/tile_{x}_{y}.png`;
    // const mapUrl = `http://develop.constantine.keenetic.name/maps/${props.mapName}/${props.mapLayer}/{z}/tile_{x}_{y}.png`;


    const leftBottom = mapParams.bounds[0];
    const rightTop = mapParams.bounds[1];

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

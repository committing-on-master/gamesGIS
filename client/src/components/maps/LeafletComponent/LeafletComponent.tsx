import { CRS } from 'leaflet';
import React from 'react';
import { MapContainer } from 'react-leaflet';
import { useAppSelector } from '../../../store/hooks';
import { mapSelectors } from '../../../store/mapProfile/state';
import { MapLayer } from './MapLayer';
import { MarkersLayer } from './MarkersLayer';
import { SpotlightArea } from './SpotlightArea';

function LeafletComponent() {
    const mapParams = useAppSelector(state => mapSelectors.containerParams(state.map));

    return (
        <MapContainer
            // Coordinates in CRS.Simple take the form of [y, x] instead of [x, y], in the same way Leaflet uses [lat, lng] instead of [lng, lat]
            crs={CRS.Simple}
            center={[mapParams.center.x, mapParams.center.y]}

            zoom={mapParams.zoom.min}
            minZoom={mapParams.zoom.min}
            maxZoom={mapParams.zoom.max}
            zoomSnap={1}
            scrollWheelZoom={true}
            doubleClickZoom={true}
        >
            <MapLayer />
            <MarkersLayer />
            <SpotlightArea />
        </MapContainer>
    );
}

export { LeafletComponent };

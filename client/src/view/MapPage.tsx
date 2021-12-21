import { CRS } from "leaflet"
import { MapContainer } from "react-leaflet"
import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { MapLayerWrapper } from "../components/maps/MapLayerWrapper"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { AwaitingComponent } from "../components/AwaitingComponent";
import { WarningComponent } from "../components/WarningComponent";
import { profileFetching } from "../store/profile/thunks";

import "./../api/fetchMockStub"
import { selectAllAreas } from "../store/areas/slice";
import { AriaMarker } from "../components/maps/AriaMarker";
import { mapSelectors } from "../store/map/state";
import { SpotlightArea } from "../components/maps/SpotlightArea";

type LoadingState = {
    status: "idle" | "loading" | "succeeded" | "failed",
    msg? : string;
}

function MapPage() {
    const { profileName } = useParams();
    const navigate = useNavigate();
    if (!profileName) {
        navigate("404");
    }
    
    const [loadingState, setLoadingState] = useState<LoadingState>({status: "idle", msg: "Profile loading, please wait."});
    const dispatch = useAppDispatch();
    const markerAreas = useAppSelector(state => selectAllAreas(state.areas));
    const mapCenter = useAppSelector(state => mapSelectors.center(state.map));

    const mapHost = process.env.REACT_APP_TILES_URL || "localhost:3000/map"
    const mapLayer = 0;    

    useEffect(() => {
        dispatch(profileFetching(profileName!))
            .unwrap()
            .then(res => {
                setLoadingState({status: "succeeded", msg: "profile loaded"});
            });
    }, [dispatch, profileName]);

    

    if (loadingState.status === "idle" || loadingState.status === "loading") {
        return(
            <AwaitingComponent>
                {loadingState.msg ?? <p>{loadingState.msg}</p>}
            </AwaitingComponent>
        );
    }

    if (loadingState.status === "failed") {
        return(
            <WarningComponent>
                {loadingState.msg ?? <p>{loadingState.msg}</p>}
            </WarningComponent>
        );
    }

    return (
        <MapContainer
            // Coordinates in CRS.Simple take the form of [y, x] instead of [x, y], in the same way Leaflet uses [lat, lng] instead of [lng, lat]
            crs={CRS.Simple}
            center={[mapCenter!.x, mapCenter!.y]}

            zoom={0}
            minZoom={0}
            maxZoom={4}
            zoomSnap={1}
            scrollWheelZoom={true} 
            doubleClickZoom={true} >

            <MapLayerWrapper
                mapHost={mapHost}
                mapLayer={mapLayer}
            />

            {markerAreas.map((value, index) => {
                return <AriaMarker 
                    key={value.id}
                    markerId={value.id} 
                    />
            })}

            <SpotlightArea />

        </MapContainer>
    );
}

export { MapPage }

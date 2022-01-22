import { CRS } from "leaflet"
import { MapContainer } from "react-leaflet"
import { useParams, useNavigate, Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { MapLayerWrapper } from "../components/maps/MapLayerWrapper"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { AwaitingComponent } from "../components/AwaitingComponent";
import { WarningComponent } from "../components/WarningComponent";

import { selectAllMarkers, selectIsEdit } from "../store/markers/slice";
import { AriaMarker } from "../components/maps/AriaMarker";
import { mapSelectors } from "../store/mapProfile/state";
import { SpotlightArea } from "../components/maps/SpotlightArea";
import { Sidenav } from "../components/navbar/Sidenav";
import { fetchMapProfile } from "../store/mapProfile/thunks";
import { accountSelectors } from "../store/account/state";
import { AddingMarker } from "../components/maps/AddingMarker";
import EditingMarker from "../components/maps/EditingMarker";
import { MapClickHandler } from "../components/maps/MapClickHandler";
import { EventHubProvider } from "../components/maps/EventHubProvider";

// import "./../api/fetchMockStub"

type LoadingState = {
    status: "idle" | "loading" | "succeeded" | "failed";
    msg?: string;
}

interface MapProps {
    editable: boolean;
}

function MapPage(props: MapProps) {
    console.log(props);
    const { profileName } = useParams();
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState<LoadingState>({ status: "idle", msg: "Profile loading, please wait." });

    const dispatch = useAppDispatch();
    const mapParams = useAppSelector(state => mapSelectors.containerParams(state.map));
    const editable = useAppSelector(state => accountSelectors.UserId(state.account)) === mapParams.authorId;
    const isEditingNow = useAppSelector(state => selectIsEdit(state.markers));


    useEffect(() => {
        if (!profileName) {
            navigate("404");
        }
        dispatch(fetchMapProfile(profileName!))
            .unwrap()
            .then(res => {
                setLoadingState({ status: "succeeded", msg: "profile loaded" });
            })
            .catch(error => {
                console.log(error);
                setLoadingState({ status: "failed", msg: "profile loading failed" });
            })
    }, [dispatch, navigate, profileName]);

    if (loadingState.status === "idle" || loadingState.status === "loading") {
        return (
            <AwaitingComponent>
                {loadingState.msg ?? <p>{loadingState.msg}</p>}
            </AwaitingComponent>
        );
    }

    if (loadingState.status === "failed") {
        return (
            <WarningComponent>
                {loadingState.msg ?? <p>{loadingState.msg}</p>}
            </WarningComponent>
        );
    }

    const EditButton = (editable && !props.editable) ? <Link to="editing">Еdit</Link> : undefined;

    return (
        <EventHubProvider>
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
                <MapLayerWrapper />

                {/* {markerAreas.map((value, index) => {
                return <AriaMarker 
                    key={value.id}
                    markerId={value.id} 
                    />
            })} */}

                <SpotlightArea />
            </MapContainer>
            <Sidenav
                visibility={props.editable}
                header="Markers"
            >
                {EditButton && EditButton}
                {!EditButton &&
                    <>
                        <hr />
                        {isEditingNow ? <EditingMarker /> : <AddingMarker />}
                    </>
                }

            </Sidenav>
        </EventHubProvider>
    );
}

export { MapPage };

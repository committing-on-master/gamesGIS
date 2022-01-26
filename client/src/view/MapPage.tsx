import { CRS } from "leaflet"
import { MapContainer } from "react-leaflet"
import { useParams, useNavigate, Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { MapLayerWrapper } from "../components/maps/MapLayerWrapper"
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { AwaitingComponent } from "../components/common/AwaitingComponent";
import { WarningComponent } from "../components/common/WarningComponent";

import { selectAllMarkers, selectIsEditingMode } from "../store/markers/slice";
// import { AriaMarker } from "../components/maps/AriaMarker";
import { mapSelectors } from "../store/mapProfile/state";
// import { SpotlightArea } from "../components/maps/SpotlightArea";
import { Sidenav } from "../components/navbar/Sidenav";
import { fetchMapProfile } from "../store/mapProfile/thunks";
import { accountSelectors } from "../store/account/state";
import { AddingMarker } from "../components/maps/AddingMarker";
import { EditingMarker } from "../components/maps/EditingMarker";
import { EventHubProvider } from "../components/maps/EventHubProvider";
import { LeafletComponent } from "../components/maps/LeafletComponent";
import { fetchProfileMarkers } from "../store/markers/thunks";
// import { MarkersLayerWrapper } from "../components/maps/MarkersLayerWrapper";

// import "./../api/fetchMockStub"

type LoadingState = {
    status: "idle" | "loading" | "succeeded" | "failed";
    msg?: string;
}

interface MapProps {
    editable: boolean;
}

function MapPage(props: MapProps) {
    const { profileName } = useParams();
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState<LoadingState>({ status: "idle", msg: "Profile loading, please wait." });

    const dispatch = useAppDispatch();
    const mapParams = useAppSelector(state => mapSelectors.containerParams(state.map));
    const editable = useAppSelector(state => accountSelectors.UserId(state.account)) === mapParams.authorId;
    const isEditingNow = useAppSelector(state => selectIsEditingMode(state.markers));


    useEffect(() => {
        if (!profileName) {
            navigate("404");
        }
        dispatch(fetchMapProfile(profileName!))
            .unwrap()
            .then(() => {
                dispatch(fetchProfileMarkers(profileName!))
                .unwrap()
                .then(() => {
                    setLoadingState({ status: "succeeded", msg: "profile loaded" });
                })
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
            <LeafletComponent />
            <Sidenav
                visibility={props.editable}
                header="Markers"
            >
                {EditButton && EditButton}
                {!EditButton &&
                    <>
                        <hr />
                        {isEditingNow && profileName ? <EditingMarker profileName={profileName} /> : <AddingMarker />}
                    </>
                }

            </Sidenav>
        </EventHubProvider>
    );
}

export { MapPage };

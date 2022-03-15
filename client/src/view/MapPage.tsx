import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { AwaitingComponent } from "../components/common/AwaitingComponent";
import { WarningComponent } from "../components/common/WarningComponent";

import { selectIsEditingMode } from "../store/markers/slice";
import { mapSelectors } from "../store/mapProfile/state";

import { fetchMapProfile } from "../store/mapProfile/thunks";
import { EventHubProvider } from "../components/maps/EventHubProvider";
import { LeafletComponent } from "../components/maps/LeafletComponent";
import { fetchProfileMarkers } from "../store/markers/thunks";
import { MapPanel } from "../components/panels/MapPanel";
import { SidePanel } from "../components/panels/SidePanel";

import styles from './MapPage.module.scss';

type LoadingState = {
    status: "idle" | "loading" | "succeeded" | "failed";
    msg?: string;
}

function MapPage() {
    const { profileName } = useParams();
    const navigate = useNavigate();
    const [loadingState, setLoadingState] = useState<LoadingState>({ status: "idle", msg: "Profile loading, please wait." });

    const dispatch = useAppDispatch();
    const mapParams = useAppSelector(state => mapSelectors.containerParams(state.map));
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

    return (
        <div className={styles.leafletContainer}>
        <EventHubProvider>
            <LeafletComponent />
            <SidePanel
                visibility={true}
                header="Markers"
                >
                <MapPanel />
            </SidePanel>
        </EventHubProvider>
        </div>
    );
}

export { MapPage };

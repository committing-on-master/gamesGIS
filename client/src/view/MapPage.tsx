import { useParams, useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import { useAppDispatch } from "../store/hooks";
import { useEffect, useState } from "react";

import { fetchMapProfile } from "../store/mapProfile/thunks";
import { EventHubProvider } from "../components/maps/EventHubProvider";
import { LeafletComponent } from "../components/maps/LeafletComponent";
import { fetchProfileMarkers } from "../store/markers/thunks";
import { MapPanel } from "../components/panels/MapPanel";
import { SidePanel } from "../components/panels/SidePanel";

import { ProcessState, withWaiter } from "../hocs/withWaiter";

function useFetchMapProfile(): [ProcessState, string] {
    const [text, setText] = useState('Map profile loading, please wait....');
    const [loadingState, setLoadingState] = useState<ProcessState>(ProcessState.Loading);

    const { profileName } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

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
                        setLoadingState(ProcessState.Succeeded);
                        setText('profile loaded');
                    })
            })
            .catch(error => {
                console.log(error);
                setLoadingState(ProcessState.Failed);
                setText('Map profile loading failed');
            })

    }, [dispatch, navigate, profileName]);

    return [loadingState, text];
}

const Content = withWaiter(
    () =>
        <EventHubProvider>
            <LeafletComponent />
            <SidePanel
                visibility={true}
                header="Markers"
            >
                <MapPanel />
            </SidePanel>
        </EventHubProvider>
);

function MapPage() {
    const [state, text] = useFetchMapProfile();
    return (
        <Content state={state} msg={text} size={"large"} />
    );
}

export { MapPage };

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AwaitingComponent } from "../components/AwaitingComponent";
import { WarningComponent } from "../components/WarningComponent";
import { useAppDispatch } from "../store/hooks";
import { profileFetching } from "../store/profile/thunks";

type LoadingState = {
    status: "idle" | "loading" | "succeeded" | "failed",
    msg? : string;
}

function EditingMapProfilePage() {
    const [loadingState, setLoadingState] = useState<LoadingState>({status: "idle", msg: "Profile loading, please wait."});
    const { profileName } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    if (!profileName) {
        navigate("404");
    }
    
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
        <div>
            
        </div>
    )
}

export { EditingMapProfilePage }

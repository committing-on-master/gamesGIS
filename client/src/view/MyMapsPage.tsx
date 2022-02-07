import { useNavigate } from "react-router-dom";
import { MapProfileCreationForm } from "../components/profile/MapProfileCreationForm";
import { UserMapProfiles } from "../components/profile/UserMapProfiles";
import { accountSelectors } from "../store/account/state";
import { useAppSelector } from "../store/hooks";

import "./MyMapsPage.scss"

function MyMapsPage() {
    const navigate = useNavigate();
    const userId = useAppSelector(state => accountSelectors.UserId(state.account));
    const handleProfileCreation = (name: string) => {
        navigate(`map/${name}/editing`);
    }
    if (!userId) {
        navigate("404");
        return null;
    }
    return (
        <div className="my-maps-page">
            <div className="profile-creation">
                <h3>Create profile</h3>
                <MapProfileCreationForm onCreated={handleProfileCreation}/>
            </div>
            <UserMapProfiles userId={userId}/>
        </div>
    )
}

export default MyMapsPage

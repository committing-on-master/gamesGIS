import { useNavigate } from "react-router-dom";
import { MapType } from "../api/dto/types/MapType";
import { MapProfileCreationForm } from "../components/profile/MapProfileCreationForm";
import { UserMapProfiles } from "../components/profile/UserMapProfiles";
import { accountSelectors } from "../store/account/state";
import { useAppSelector } from "../store/hooks";




function MyMapsPage() {
    const navigate = useNavigate();
    const userId = useAppSelector(state => accountSelectors.UserId(state.account));
    const handleProfileCreation = (name: string) => {
        navigate(`map/${name}/editing`);
    }
    return (
        <div>
            <MapProfileCreationForm onCreated={handleProfileCreation}/>
            {userId ? <UserMapProfiles userId={userId}/> : null}
        </div>
    )
}

export default MyMapsPage

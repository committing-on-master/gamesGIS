import { useNavigate } from "react-router-dom";
import { MapType } from "../api/dto/types/MapType";
import { MapProfileCreationForm } from "../components/profile/MapProfileCreationForm";




function MyMapsPage() {
    const navigate = useNavigate();
    const handleProfileCreation = (name: string) => {
        navigate(`map/${name}/editing`);
    }
    return (
        <div>
            <MapProfileCreationForm onCreated={handleProfileCreation}/>
        </div>
    )
}

export default MyMapsPage

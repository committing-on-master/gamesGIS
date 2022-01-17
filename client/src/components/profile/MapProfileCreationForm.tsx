import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MapProfileDTO } from "../../api/dto/request/MapProfileDTO";
import { ErrorDTO } from "../../api/dto/response/ErrorDTO";
import { MapType } from "../../api/dto/types/MapType";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { SchemaValidation } from "../schemas/schemaValidation";

import "./MapProfileCreationForm.scss";

type CreatingMapProfile = {
    profileName: string;
    map: MapType;
}

interface ProfileCreationProps {
    onCreated?(name: string): void;
}

function MapProfileCreationForm(props: ProfileCreationProps) {
    const { register, handleSubmit, setError, reset, formState: { errors }, watch } = useForm<CreatingMapProfile>();
    const [backendError, setBackendError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<CreatingMapProfile> = (data) => {
        const body: MapProfileDTO = {
            map: data.map
        }
        RequestWrapper.endPoint(`map-profile/${data.profileName}`).withAuth().post(body).send<null, ErrorDTO>()
            .then(res => {
                console.log("get creation response");
                if (res.ok) {
                    if (props.onCreated) {
                        props.onCreated(data.profileName);
                    }
                    reset();
                    return Promise.resolve();
                }
                setBackendError(res.failure?.message);
                return Promise.resolve();
            })
            .catch((error) => {
                console.log(error);
                setBackendError("Network connection error");
                return Promise.resolve();
            });
    }

    const RadioGroup: JSX.Element[] = [];
    for (let index = 0; index < Object.keys(MapType).length / 2; ++index) {
        RadioGroup.push(<input type="radio" value={index} {...register("map")}/>);
        RadioGroup.push(<label>{MapType[index]}</label>);
    }    

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Name</label>
                <input type="text" placeholder="profile name ..." {...register("profileName", SchemaValidation.ProfileName)} />
                {errors.profileName && <p>{errors.profileName.message}</p>}
            </div>

            <div>
                <label>Map</label>
                <br/>

                {RadioGroup}
                {errors.profileName && <p>{errors.profileName.message}</p>}
            </div>
            <button>Create</button>
            {backendError && <p>{backendError}</p>}
        </form>
    )
}

export { MapProfileCreationForm }

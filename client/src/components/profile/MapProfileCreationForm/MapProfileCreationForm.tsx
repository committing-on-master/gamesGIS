import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { MapProfileDTO } from "./../../../api/dto/request/MapProfileDTO";
import { ErrorDTO } from "./../../../api/dto/response/ErrorDTO";
import { MapType } from "./../../../api/dto/types/MapType";
import { RequestWrapper } from "./../../../api/JsonRequestWrapper";
import { SchemaValidation } from "./schemaValidation";

import styles from './MapProfileCreationForm.module.scss';
import { AreaChoicer, ChoicerAreaType } from "./../AreaChoicer";
import { EndPoints } from "../../../api/endPoints";
import { nameofPropChecker } from "../../../generics/nameofPropChecker";

const previewUrl = (name: string) => `${EndPoints.Protocol}://${EndPoints.Host}/img/maps/${name}.png`;
const areas: ChoicerAreaType[] = [
    {
        map: MapType.Woods,
        name: "Woods",
        url: previewUrl("Woods")
    },
    {
        map: MapType.Factory,
        name: "Factory",
        url: previewUrl("Factory")
    },
    {
        map: MapType.Customs,
        name: "Customs",
        url: previewUrl("Customs")
    },
    {
        map: MapType.Interchange,
        name: "Interchange",
        url: previewUrl("Interchange")
    },
    {
        map: MapType.Labs,
        name: "Labs",
        url: previewUrl("Labs")
    },
    {
        map: MapType.Shoreline,
        name: "Shoreline",
        url: previewUrl("Shoreline")
    },
    {
        map: MapType.Reserve,
        name: "Reserve",
        url: previewUrl("Reserve")
    },
    {
        map: MapType.Lighthouse,
        name: "Lighthouse",
        url: previewUrl("Lighthouse")
    },
]

type CreatingMapProfile = {
    profileName: string;
    map: MapType;
}

interface ProfileCreationProps {
    onCreated?(name: string): void;
}

function MapProfileCreationForm(props: ProfileCreationProps) {
    const { register, handleSubmit, setError, reset, setValue, formState: { errors } } = useForm<CreatingMapProfile>({ defaultValues: { map: MapType.Woods } });
    const [backendError, setBackendError] = useState<string | undefined>(undefined);

    const onSubmit: SubmitHandler<CreatingMapProfile> = (data) => {
        const body: MapProfileDTO = {
            profileName: data.profileName,
            map: data.map
        }
        RequestWrapper.endPoint("map-profiles").withAuth().post(body).send<null, ErrorDTO>()
            .then(res => {
                if (res.ok) {
                    if (props.onCreated) {
                        props.onCreated(data.profileName);
                    }
                    reset();
                    return Promise.resolve();
                }
                if (res.failure?.errors !== undefined && res.failure?.errors?.length !== 0) {
                    res.failure.errors.forEach((error) => {
                        switch (error.param) {
                            case nameofPropChecker<MapProfileDTO>("profileName"):
                                setError("profileName", { message: error.msg }, { shouldFocus: true });
                                break;
                            case nameofPropChecker<MapProfileDTO>("map"):
                                setError("map", { message: error.msg });
                                break;
                            default:
                                throw new Error(res.failure?.message);
                        }
                    })
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

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

            <label>Name</label>
            <input
                className={styles.input}
                type="text"
                placeholder="profile name ..."
                {...register("profileName", SchemaValidation.ProfileName)}
            />
            {errors.profileName && <p className={styles.error}>{errors.profileName.message}</p>}

            <label>Map</label>
            <input
                type="number"
                hidden={true}
                {...register("map", SchemaValidation.Map)}
            />
            <AreaChoicer
                areas={areas}
                onChoiseChanged={(map) => { setValue("map", map) }}
            />
            {errors.map && <p className={styles.error}>{errors.map.message}</p>}

            <button className={styles.button}>Create</button>
            {backendError && <p className={styles.error}>{backendError}</p>}
        </form>
    )
}

export { MapProfileCreationForm }

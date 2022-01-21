import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Point } from '../../api/dto/types/Point';
import { useAppSelector } from '../../store/hooks';
import { selectEditableMarker } from '../../store/markers/slice';
import { SchemaValidation } from '../schemas/schemaValidation';
import { useEventHub } from './EventHubProvider';

type Inputs = {
    name: string,
    description: string,
    position?: Point,
    color: string;
    bound: Point[]
};

function EditingMarker() {
    const marker = useAppSelector(state => selectEditableMarker(state.markers));
    const eventHub = useEventHub();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            name: marker?.name,
            description: marker?.description,
            color: marker?.color
        }
    });

    useEffect(() => {
      const unsubCallback = eventHub.subscribe(onMapClick);
      return () => unsubCallback();
    }, [eventHub]);
    
    const onMapClick = (eventArg: {x: number, y:number}) => {
        console.log(JSON.stringify(eventArg, null, 4));
    }

    if (!marker) {
        return(null);
    }
    const onSubmit: SubmitHandler<Inputs> = data => {
        // dispatch(createMarker(data.name));
        alert(JSON.stringify(data, null, 4));
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <label>Marker name</label>
            <input type="text" placeholder="...marker name" {...register("name", SchemaValidation.MarkerName)}/>
            {errors.name && <p>{errors.name.message}</p>}

            <label>Description</label>
            <input type="text" placeholder="...description" {...register("description", SchemaValidation.MarkerDescription)}/>
            {errors.description && <p>{errors.description.message}</p>}

            <input type="color" {...register("color", SchemaValidation.MarkerColor)}/>
            {errors.color && <p>{errors.color.message}</p>}
            <input type="submit" />
        </form>
    );
}

export default EditingMarker;

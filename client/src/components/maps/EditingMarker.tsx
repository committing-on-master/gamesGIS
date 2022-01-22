import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Point } from '../../api/dto/types/Point';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectEditableMarker, updateMarker } from '../../store/markers/slice';
import { SchemaValidation } from '../schemas/schemaValidation';
import { useEventHub } from './EventHubProvider';

type Inputs = {
    name: string,
    description: string,
    // position?: Point,
    color: string;
    // bound: Point[]
};

enum FocusElement {
    Another = 0,
    Position,
    Bound
}

function EditingMarker() {
    const marker = useAppSelector(state => selectEditableMarker(state.markers));
    const dispatch = useAppDispatch();
    const eventHub = useEventHub();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            name: marker?.name,
            description: marker?.description,
            color: marker?.color,
        }
    });
    
    useEffect(() => {
        const unsubCallback = eventHub.subscribe(onMapClick);
        return () => unsubCallback();
    }, [eventHub]);
    
    const [elementFocus, setElementFocus] = useState(FocusElement.Another);
    
    const getFocus = () => elementFocus;
    
    // подписался этой функцией
    const onMapClick = (eventArg: {x: number, y:number}) => {
        console.log(JSON.stringify(eventArg, null, 4));
        const elementFocus = getFocus();
        // хотел в этом месте, в зависимости от состояния компоненты реагировать на click-а по разному
        switch (elementFocus) { // сейчас тут замыкается состояние фокуса на момент подписки, что не верно
            case FocusElement.Position:
                dispatch(updateMarker({
                    id: marker!.id,
                    changes: { position: {
                        x: eventArg.x,
                        y: eventArg.y
                    }}}));
                break;
            case FocusElement.Bound:
                break;
            default:
                break;
        }
    }

    if (!marker) {
        return(null);
    }

    const onSubmit: SubmitHandler<Inputs> = data => {
        // dispatch(createMarker(data.name));
        alert(JSON.stringify(data, null, 4));
    }

    const positionText = marker.position ? `x: ${marker.position.x.toFixed(3)} y: ${marker.position.y.toFixed(3)}` : "";
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

            <label>Marker position</label>
            <input 
                type={"text"}
                placeholder="...set focus and map click"
                readOnly={true}
                value={positionText}
                onFocus={() => setElementFocus(FocusElement.Position)}
                onBlur={() => setElementFocus(FocusElement.Another)}
            />
        </form>
    );
}

export default EditingMarker;

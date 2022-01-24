import React, { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { Point } from '../../api/dto/types/Point';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectEditableMarker, updateMarkerPosition } from '../../store/markers/slice';
import { SchemaValidation } from '../schemas/schemaValidation';
import { useEventHub } from './EventHubProvider';

import "./EditingMarker.scss";

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
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            name: marker?.name,
            description: marker?.description,
            color: marker?.color,
        }
    });

    const [elementFocus, setElementFocus] = useState(FocusElement.Another);
    const stateRef = useRef(elementFocus);
    const eventHub = useEventHub();

    function setFocus(focus: FocusElement) {
        stateRef.current = focus;
        setElementFocus(focus);
    }

    useEffect(() => {

        function onMapClick(eventArg: { x: number, y: number }) {
            switch (stateRef.current) {
                case FocusElement.Position:
                    setFocus(FocusElement.Another);
                    dispatch(updateMarkerPosition({
                        x: eventArg.x,
                        y: eventArg.y
                    }));
                    break;
                case FocusElement.Bound:
                    break;
                default:
                    break;
            }
        }

        const unsubscribe = eventHub.subscribe(onMapClick);
        return () => unsubscribe();
    }, [dispatch, eventHub, marker]);

    if (!marker) {
        return (null);
    }

    const onSubmit: SubmitHandler<Inputs> = data => {
        // dispatch(createMarker(data.name));
        alert(JSON.stringify(data, null, 4));
    }

    const positionText = marker.position ? `x: ${marker.position.x.toFixed(3)} y: ${marker.position.y.toFixed(3)}` : "";
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <label>Marker name</label>
            <input type="text" placeholder="...marker name" {...register("name", SchemaValidation.MarkerName)} />
            {errors.name && <p>{errors.name.message}</p>}

            <label>Description</label>
            <input type="text" placeholder="...description" {...register("description", SchemaValidation.MarkerDescription)} />
            {errors.description && <p>{errors.description.message}</p>}

            <input type="color" {...register("color", SchemaValidation.MarkerColor)} />
            {errors.color && <p>{errors.color.message}</p>}
            <input type="submit" />

            <label>Marker position</label>
            <input
                type={"text"}
                placeholder="...set focus and map click"
                readOnly={true}
                value={positionText}
                onFocus={() => {
                    setFocus(FocusElement.Position);
                }}
            />
        </form>
    );
}

export { EditingMarker };

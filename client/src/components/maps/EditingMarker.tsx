import React, { useEffect, useRef, useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addAreaCoordinates, createNewMarker, selectEditableMarker, setAreaColor, updateMarkerPosition } from '../../store/markers/slice';
import { SchemaValidation } from '../schemas/schemaValidation';
import { useEventHub } from './EventHubProvider';

import "./EditingMarker.scss";
import { CoordinatesList } from './CoordinatesList';
import { saveMarker } from '../../store/markers/thunks';

type Inputs = {
    name: string,
    description: string,
    // position?: Point,
    color: string;
    // bound: Point[]
};

enum FocusElement {
    Another = 0,
    Position = 1,
    Bound = 2
}

interface EditingMarkerProps {
    profileName: string
} 

function EditingMarker(props: EditingMarkerProps) {
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
                    dispatch(updateMarkerPosition(eventArg));
                    break;
                case FocusElement.Bound:
                    dispatch(addAreaCoordinates(eventArg));
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

    const handleColorChange = (arg: React.ChangeEvent<HTMLInputElement>) => {
        const color = arg.target.value;
        dispatch(setAreaColor(color));
    }

    const onSubmit: SubmitHandler<Inputs> = data => {
        dispatch(saveMarker(props.profileName));
        
    }

    const positionText = marker.position ? `x: ${marker.position.x.toFixed(3)} y: ${marker.position.y.toFixed(3)}` : "";
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <label>Marker name</label>
            <input type="text" placeholder="...marker name" {...register("name", SchemaValidation.MarkerName)} />
            {errors.name && <p>{errors.name.message}</p>}

            <label>Description</label>
            <textarea placeholder="...description" {...register("description", SchemaValidation.MarkerDescription)} />
            {errors.description && <p>{errors.description.message}</p>}

            <input type="color" {...register("color", {onChange: handleColorChange, ...SchemaValidation.MarkerColor} )} />
            {errors.color && <p>{errors.color.message}</p>}

            <hr />
            <label>Marker position</label>
            <input
                type={"text"}
                placeholder="...set focus and map click"
                readOnly={true}
                value={positionText}
                onClick={() => setFocus(elementFocus === FocusElement.Position ? FocusElement.Another : FocusElement.Position)}
            />

            <hr />
            <label>Area coordinates</label>
            <input
                type={"text"}
                placeholder="...set focus and map click"
                readOnly={true}
                onClick={() => setFocus(elementFocus === FocusElement.Bound ? FocusElement.Another : FocusElement.Bound)}
            />
            <CoordinatesList />
            <hr />
            <input type="submit" />
        </form>
    );
}

export { EditingMarker };

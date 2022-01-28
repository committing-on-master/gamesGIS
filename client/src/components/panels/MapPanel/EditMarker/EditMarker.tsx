import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addAreaCoordinates, cancelEditionMode, selectEditableMarker, setAreaColor, updateMarkerPosition } from '../../../../store/markers/slice';
import { saveEditingMarker } from '../../../../store/markers/thunks';
import { useEventHub } from '../../../maps/EventHubProvider';
import { EditSchemaValidation } from './SchemaValidation';
import { CoordinatesList } from './CoordinatesList';

import "./EditMarker.scss";

type Inputs = {
    name: string;
    description: string;
    color: string;
};

enum FocusElement {
    Another = 0,
    Position = 1,
    Bound = 2
}

function EditMarker() {
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
        dispatch(saveEditingMarker({name: data.name, description: data.description}));
    }
    const onCancel = (eventArg: React.MouseEvent<HTMLButtonElement>) => {
        eventArg.preventDefault();
        dispatch(cancelEditionMode());
    }

    const positionText = marker.position ? `x: ${marker.position.x.toFixed(3)} y: ${marker.position.y.toFixed(3)}` : "";
    return (
        <form onSubmit={handleSubmit(onSubmit)} >
            <label>Marker name</label>
            <input type="text" placeholder="...marker name" {...register("name", EditSchemaValidation.MarkerName)} />
            {errors.name && <p>{errors.name.message}</p>}

            <label>Description</label>
            <textarea placeholder="...description" {...register("description", EditSchemaValidation.MarkerDescription)} />
            {errors.description && <p>{errors.description.message}</p>}

            <input type="color" {...register("color", {onChange: handleColorChange, ...EditSchemaValidation.MarkerColor} )} />
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
            <button onClick={onCancel}>Cancel</button>
        </form>
    );
}

export { EditMarker };

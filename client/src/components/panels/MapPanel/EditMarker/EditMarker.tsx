import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { addAreaCoordinates, cancelEditionMode, removeAreaCoordinates, selectEditableMarker, setAreaColor, updateMarkerPosition } from '../../../../store/markers/slice';
import { deleteProfileMarker, saveEditingMarker } from '../../../../store/markers/thunks';
import { useEventHub } from '../../../maps/EventHubProvider';
import { EditSchemaValidation } from './SchemaValidation';
import { CoordinatesList } from './CoordinatesList';
import { EditingState } from '../../../../store/markers/types';
import classNames from 'classnames';

import styles from './EditMarker.module.scss';

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
    const formRef = useRef<HTMLDivElement>(null);
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

        const unsubscribe = eventHub.subscribe("onMapClick", onMapClick);
        return () => unsubscribe();
    }, [dispatch, eventHub, marker]);

    if (!marker) {
        return (null);
    }

    const positionCss = classNames(
        styles.coordinateInput,
        { [styles.coordinateInput_active]: elementFocus === FocusElement.Position }
    );
    const areaCss = classNames(
        styles.coordinateInput,
         { [styles.coordinateInput_active]: elementFocus === FocusElement.Bound }
    );

    const handleColorChange = (arg: React.ChangeEvent<HTMLInputElement>) => {
        const color = arg.target.value;
        dispatch(setAreaColor(color));
    }
    const onSubmit: SubmitHandler<Inputs> = data => {
        dispatch(saveEditingMarker({ name: data.name, description: data.description }));
    }
    const onCancel = (eventArg: React.MouseEvent<HTMLButtonElement>) => {
        eventArg.preventDefault();
        dispatch(cancelEditionMode());
    }
    const onDelete = (eventArg: React.MouseEvent<HTMLButtonElement>) => {
        eventArg.preventDefault();
        marker.id && dispatch(deleteProfileMarker(marker.id));
    }
    const handlePositionBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
        if (formRef?.current?.contains(e.relatedTarget)) {
            setElementFocus(FocusElement.Another);
        }
    }
    const handlerAreaCoordinateDeletion = (eventArg: React.MouseEvent<HTMLButtonElement>) => {
        eventArg.preventDefault();
        dispatch(removeAreaCoordinates());
    }

    const positionText = marker.position ? `x: ${marker.position.x.toFixed(3)} y: ${marker.position.y.toFixed(3)}` : "";
    return (
        <div ref={formRef} className={styles.container} >
            <h3>Marker Edition form</h3>
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)} >
                <label className={styles.label} >Marker name</label>
                <input 
                    className={styles.input} 
                    type="text"
                    placeholder="...marker name"
                    {...register("name", EditSchemaValidation.MarkerName)}
                />
                {errors.name && <p className={styles.error}>{errors.name.message}</p>}

                <label className={styles.label} >Description</label>
                <textarea 
                    className={styles.textArea}
                    placeholder="...description" 
                    {...register("description", EditSchemaValidation.MarkerDescription)} 
                />
                {errors.description && <p className={styles.error}>{errors.description.message}</p>}

                <label className={`${styles.label} ${styles.label_Colored}`}>Area color</label>
                <input
                    type="color"
                    {...register("color", { onChange: handleColorChange, ...EditSchemaValidation.MarkerColor })} 
                />
                {errors.color && <p className={styles.error}>{errors.color.message}</p>}

                <label className={styles.label}>Marker position</label>
                <input
                    className={positionCss}
                    type={"text"}
                    placeholder="set focus and map click..."
                    readOnly={true}
                    value={positionText}
                    onClick={() => setFocus(elementFocus === FocusElement.Position ? FocusElement.Another : FocusElement.Position)}
                    onBlur={handlePositionBlur}
                />

                <label className={styles.label}>Area coordinates</label>
                <div className={styles.coordinateInputGroup}>
                    <input
                        className={areaCss}
                        type={"text"}
                        placeholder="set focus and map click..."
                        readOnly={true}
                        onClick={() => setFocus(elementFocus === FocusElement.Bound ? FocusElement.Another : FocusElement.Bound)}
                    />
                    <button 
                        className={styles.button_danger}
                        onClick={handlerAreaCoordinateDeletion}
                        title='Clear all coordinates'
                    >X</button>
                </div>
                <CoordinatesList />
                
                <div className={styles.controls}>
                    <input className={styles.button_primary} type="submit" value={'Save'} />
                    <button className={styles.button} onClick={onCancel}>Cancel</button>
                    {marker.state === EditingState.Saved ? <button className={styles.button_danger} onClick={onDelete}>Delete</button> : null}
                </div>
            </form>
        </div>
    );
}

export { EditMarker };

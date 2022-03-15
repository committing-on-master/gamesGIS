import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectAllMarkers, turnOffSpotlightBlur, turnOnSpotlightHover } from '../../../../store/markers/slice';
import { EditSpanComponent } from '../../../common/EditSpanComponent';
import { useEventHub } from '../../../maps/EventHubProvider';
import { CreationMarker } from './CreationMarker';

import styles from './MarkerList.module.scss';

interface MarkerListProps {
    editable: boolean;
    onEditionClick(markerId: number): void;
    onCreationClick(name: string): void;
}

function MarkerList(props: MarkerListProps) {
    const [filter, setFilter] = useState("");

    return (
        <div className={styles.container}>
            {props.editable ? <CreationMarker onCreate={props.onCreationClick} /> : null}
            <input type="text" 
                className={styles.input}
                placeholder='Markers filter...'
                onChange={(eventArg) => setFilter(eventArg.target.value)} 
            />
            <List editable={props.editable} filter={filter} onEditClick={props.onEditionClick} />
        </div>
    );
}

function List(props: {
    filter: string
    editable: boolean;
    onEditClick(markerId: number): void;
}) {
    const markers = useAppSelector(state => selectAllMarkers(state.markers.saved));
    const dispatch = useAppDispatch();
    const eventHub = useEventHub();

    const filtered = props.filter === "" ? markers : markers.filter((value) => value.name.toLowerCase().includes(props.filter.toLowerCase()));
    const turnOnSpotlightArea = (id: number) => {
        dispatch(turnOnSpotlightHover(id));
    }
    const turnOffSpotlightArea = () => {
        dispatch(turnOffSpotlightBlur());
    }
    const handleMarkerClick = (id: number) => {
        eventHub.publish("onMarkerPanelClick", {markerId: id});
    }
    const listElements = filtered.map((value) => {
        return (
            <li 
                className={styles.list_item}
                key={value.id}
                onMouseEnter={() => turnOnSpotlightArea(value.id)}
                onMouseLeave={turnOffSpotlightArea}
                onClick={() => handleMarkerClick(value.id)}
            >
                {value.name}
                {props.editable ? <EditSpanComponent className={styles.icon} id={value.id} onClick={props.onEditClick} /> : null}
            </li>
        )
    });

    return (
        <ul className={styles.list}>
            {listElements}
        </ul>
    );
}

export { MarkerList };

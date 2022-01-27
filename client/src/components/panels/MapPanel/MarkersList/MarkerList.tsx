import React, { useState } from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectAllMarkers } from '../../../../store/markers/slice';
import { EditSpanComponent } from '../../../common/EditSpanComponent';
import { CreationMarker } from './CreationMarker';

import "./MarkerList.scss";

interface MarkerListProps {
    editable: boolean;
    onEditionClick(markerId: number): void;
    onCreationClick(name: string): void;
}

function MarkerList(props: MarkerListProps) {
    const [filter, setFilter] = useState("");

    return (
        <div>
            <input type="text" onChange={(eventArg) => setFilter(eventArg.target.value)} />
            {props.editable ? <CreationMarker onCreate={props.onCreationClick} /> : null}
            <List editable={props.editable} filter={filter} onEditClick={props.onEditionClick} />
        </div>
    );
}

function List(props: {
    filter: string
    editable: boolean;
    onEditClick(markerId: number): void;
}) {
    const markers = useAppSelector(state => selectAllMarkers(state.markers));
    const filtered = props.filter === "" ? markers : markers.filter((value) => value.name.toLowerCase().includes(props.filter.toLowerCase()));
    const listElements = filtered.map((value) => {
        return (
            <li key={value.id}>
                {value.name}
                {props.editable ? <EditSpanComponent id={value.id} onClick={props.onEditClick} /> : null}
            </li>
        )
    });

    return (
        <ul>
            {listElements}
        </ul>
    );
}

export { MarkerList };

import React from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectEditingMarkerIconParams } from '../../../../../store/markers/slice';
import { AriaMarker } from '../AreaMarker/AriaMarker';

function EditableMode() {
    const marker = useAppSelector(state => selectEditingMarkerIconParams(state.markers));
    if (!marker) {
        return null;
    }
    return <AriaMarker name={marker.name} position={marker.position} />
}

export { EditableMode };

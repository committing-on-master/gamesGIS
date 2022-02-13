import React from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectEditingMarkerIconParams } from '../../../../../store/markers/slice';
import { AreaMarkerEditable } from './AreaMarkerEditable';

function EditableMode() {
    const marker = useAppSelector(state => selectEditingMarkerIconParams(state.markers));
    if (!marker) {
        return null;
    }
    return <AreaMarkerEditable name={marker.name} position={marker.position} />
}

export { EditableMode };

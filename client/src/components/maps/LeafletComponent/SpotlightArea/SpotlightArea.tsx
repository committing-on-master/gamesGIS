import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import { selectIsEditingMode } from '../../../../store/markers/slice';
import { EditableMode } from './EditableMode';
import { ReviewMode } from './ReviewMode';

function SpotlightArea() {
    const editableMode = useAppSelector(state => selectIsEditingMode(state.markers));
    if (editableMode) {
        return <EditableMode />
    }
    return <ReviewMode />
}

export { SpotlightArea };

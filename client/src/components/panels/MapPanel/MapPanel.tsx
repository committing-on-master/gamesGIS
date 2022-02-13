import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createNewMarker, editSavedMarker, selectIsEditingMode } from '../../../store/markers/slice';
import { rootSelectors } from '../../../store/rootSelectors/rootSelectors';
import { EditMarker } from './EditMarker';
import { MarkerList } from './MarkersList';

function MapPanel() {
    const editable = useAppSelector(state => rootSelectors.profileAuthorship(state));
    const editingMode = useAppSelector(state => selectIsEditingMode(state.markers));
    const dispatch = useAppDispatch();

    if (editingMode) {
        return <EditMarker />
    }
    
    const handleCreate = (name: string) => {
        dispatch(createNewMarker(name));
    }
    const handleEdit = (id: number) => {
        dispatch(editSavedMarker(id));
    }
    return (
        <MarkerList 
            editable={editable}
            onCreationClick={handleCreate}
            onEditionClick={handleEdit}
        />
    );
}

export { MapPanel };

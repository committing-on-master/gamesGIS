import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAllMarkers, selectEditableMarker, selectEditingMarkerIconParams, selectIsEditingMode } from '../../store/markers/slice';
import { AriaMarker } from "./AriaMarker";

function MarkersLayerWrapper() {
    const editableMode = useAppSelector(state => selectIsEditingMode(state.markers));
    if (editableMode) {
        return <EditableMarker />
    }
    return <AllMarkers />;
}

// так себе название
function EditableMarker() {
    const marker = useAppSelector(state => selectEditingMarkerIconParams(state.markers));
    if (!marker) {
        return null;
    }
    return <AriaMarker name={marker.name} position={marker.position} />
}

function AllMarkers() {
    const markers = useAppSelector(state => selectAllMarkers(state.markers));
    const IconsElements = markers.map((value, index) => {
                return <AriaMarker 
                    key={value.id}
                    name={value.name} 
                    position={value.position}
                    />
            })
    return <>{IconsElements}</>;
}

export { MarkersLayerWrapper };

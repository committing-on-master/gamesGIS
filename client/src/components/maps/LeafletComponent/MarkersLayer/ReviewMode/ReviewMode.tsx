import React from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectAllMarkers } from '../../../../../store/markers/slice';
import { AriaMarker } from '../AreaMarker/AriaMarker';

function ReviewMode() {
    const markers = useAppSelector(state => selectAllMarkers(state.markers.saved));
    const IconsElements = markers.map((value, index) => 
        <AriaMarker
            key={value.id}
            name={value.name}
            position={value.position}
            id={value.id}
        />
    )

    return (
        <>
            {IconsElements}
        </>
    );
}

export { ReviewMode };

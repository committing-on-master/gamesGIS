import React from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectAllMarkers } from '../../../../../store/markers/slice';
import { AreaMarkerReview } from './AreaMarkerReview';

function ReviewMode() {
    const markers = useAppSelector(state => selectAllMarkers(state.markers.saved));
    const IconsElements = markers.map((value, index) => 
        <AreaMarkerReview
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

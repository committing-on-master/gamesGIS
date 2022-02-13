import React from "react";
import { Marker } from "react-leaflet";
import { Point } from "../../../../../../api/dto/types/Point";
import { markerIcon } from "../../markerIcon";

interface AreaMarkerEditableProps {
    position: Point;
    name: string;
}

function AreaMarkerEditable(props: AreaMarkerEditableProps) {
    return (
        <Marker
            position={[props.position.x, props.position.y]}
            icon={markerIcon}
            title={props.name}
        />
    );
}

export { AreaMarkerEditable };

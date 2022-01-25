import { useState } from "react";
import { selectMarkerById } from "../../../store/markers/slice";
import { useAppSelector } from "../../../store/hooks";
import { AreaImages } from "./AreaImages";

import "./PopupBody.scss"

interface PopupBodyProps {
	markerId: number;
}

function PopupBody(props: PopupBodyProps) {
    const marker = useAppSelector(state => selectMarkerById(state.markers, props.markerId));
    const [areaGalleryVisability, setAreaGalleryVisability] = useState(false);
    if (!marker) {
        return null;
    }
    
    return (
        <section>
            <h1>{marker.name}</h1>
            <p>{marker.description}</p>
            {/* {areaGalleryVisability && <AreaImages areaPhotosIds={marker.} />} */}
        </section>
    )
}

export { PopupBody }
import { LeafletEventHandlerFnMap, Popup as LPopup } from "leaflet";
import { useRef } from "react";
import { Popup, Marker } from "react-leaflet";
import { Point } from "../../../../../api/dto/types/Point";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
// import { removeSpotlightArea, setSpotlightArea } from "../../store/mapProfile/slice";
import { PopupBody } from "../../../AreaPopup/PopupBody";
import { markerIcon } from "./markerIcon";

interface MarkerProps {
	name: string;
	position: Point;
}

function AriaMarker(props: MarkerProps) {
	// const popupRef = useRef<LPopup>(null);

	// const handlePopupOpen = () => { dispatch(setSpotlightArea(marker.id)) }
	// const handlePopupClose = () => { dispatch(removeSpotlightArea(marker.id)) }
	// const markerEventsHandlers: LeafletEventHandlerFnMap = {
	// 	mouseover: () => {
	// 		dispatch(setSpotlightArea(marker.id));
	// 	},
	// 	mouseout: () => {
	// 		if (popupRef.current && !popupRef.current.isOpen()) {
	// 			dispatch(removeSpotlightArea(marker.id));
	// 		}
	// 	}
	// }

	return (
		<Marker
			position={[props.position.x, props.position.y]}
			icon={markerIcon}
			title={props.name}
			// eventHandlers={markerEventsHandlers}
		>
			{/* <Popup
				ref={popupRef}
				onOpen={handlePopupOpen}
				onClose={handlePopupClose}
			>
				< PopupBody markerId={marker.id} />
			</Popup> */}
		</Marker>
	)
}

export { AriaMarker };

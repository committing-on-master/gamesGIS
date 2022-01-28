import { LeafletEventHandlerFnMap, Popup as LPopup } from "leaflet";
import { useRef } from "react";
import { Popup, Marker } from "react-leaflet";
import { Point } from "../../../../../api/dto/types/Point";
import { useAppDispatch, useAppSelector } from "../../../../../store/hooks";
import { turnOffSpotlightBlur, turnOffSpotlightClose, turnOnSpotlightHover, turnOnSpotlightSelect } from "../../../../../store/markers/slice";
// import { removeSpotlightArea, setSpotlightArea } from "../../store/mapProfile/slice";
import { PopupBody } from "../../../AreaPopup/PopupBody";
import { markerIcon } from "./markerIcon";

interface MarkerProps {
	name: string;
	position: Point;
	id?: number;
}

function AriaMarker(props: MarkerProps) {
	const popupRef = useRef<LPopup>(null);
	const dispatch = useAppDispatch();

	const handlePopupOpen = () => { props.id && dispatch(turnOnSpotlightSelect(props.id)) }
	const handlePopupClose = () => { dispatch(turnOffSpotlightClose()) }
	const markerEventsHandlers: LeafletEventHandlerFnMap = {
		mouseover: () => {
			props.id && dispatch(turnOnSpotlightHover(props.id));
		},
		mouseout: () => {
			if (popupRef.current && !popupRef.current.isOpen()) {
				props.id && dispatch(turnOffSpotlightBlur());
			}
		}
	}

	return (
		<Marker
			position={[props.position.x, props.position.y]}
			icon={markerIcon}
			title={props.name}
			eventHandlers={markerEventsHandlers}
		>
			<Popup
				ref={popupRef}
				onOpen={handlePopupOpen}
				onClose={handlePopupClose}
			>
				{props.id && < PopupBody markerId={props.id} /> }
			</Popup>
		</Marker>
	)
}

export { AriaMarker };

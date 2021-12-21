import { LeafletEventHandlerFnMap, Popup as LPopup } from "leaflet";
import { useRef } from "react";
import { Popup, Marker } from "react-leaflet";
import { selectAreaById } from "../../store/areas/slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { removeSpotlightArea, setSpotlightArea } from "../../store/map/slice";
import { markerIcon } from "./markerIcon";

interface MarkerProps {
	markerId: number;
}

function AriaMarker(props: MarkerProps) {
	const marker = useAppSelector(state => selectAreaById(state.areas, props.markerId));
	const dispatch = useAppDispatch();
	const popupRef = useRef<LPopup>(null);

	if (!marker) {
		return (null);
	}

	const handlePopupOpen = () => { dispatch(setSpotlightArea(marker.id)) }
	const handlePopupClose = () => { dispatch(removeSpotlightArea(marker.id)) }

	const markerEventsHandlers: LeafletEventHandlerFnMap = {
		mouseover: () => {
			dispatch(setSpotlightArea(marker.id));
		},
		mouseout: () => {
			if (popupRef.current && !popupRef.current.isOpen()) {
				dispatch(removeSpotlightArea(marker.id));
			}
		}
	}

	return (
		<Marker
			position={[marker.position.x, marker.position.y]}
			icon={markerIcon}
			title={marker.name}
			eventHandlers={markerEventsHandlers}
		>
			<Popup
				ref={popupRef}
				onOpen={handlePopupOpen}
				onClose={handlePopupClose}
			>
				{marker.name} <br />
				A pretty CSS3 popup. <br />
				Easily customizable.
				{/* <PopupBody /> */}
			</Popup>
		</Marker>
	)
}

export { AriaMarker }

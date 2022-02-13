import { LeafletEventHandlerFnMap, Popup as LPopup, Marker as LMarker } from 'leaflet';
import React, { useEffect, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Point } from '../../../../../../api/dto/types/Point';
import { useAppDispatch } from '../../../../../../store/hooks';
import { turnOffSpotlightBlur, turnOffSpotlightClose, turnOnSpotlightHover, turnOnSpotlightSelect } from '../../../../../../store/markers/slice';
import { PopupBody } from '../../../../AreaPopup/PopupBody';
import { useEventHub } from '../../../../EventHubProvider';
import { markerIcon } from '../../markerIcon';

interface AreaMarkerReviewProps {
    name: string;
    position: Point;
    id: number;
}

function AreaMarkerReview(props: AreaMarkerReviewProps) {
    const dispatch = useAppDispatch();
    const popupRef = useRef<LPopup>(null);
    const eventHub = useEventHub();
    const markerRef = useRef<LMarker>(null);

    useEffect(() => {
        const openPopupEvent = (arg: { markerId: number }) => {
            if (arg.markerId === props.id 
                && popupRef.current 
                && !popupRef.current.isOpen()
                && markerRef.current) {
                markerRef.current?.openPopup();
            }
        }
        const unsubscribe = eventHub.subscribe("onMarkerPanelClick", openPopupEvent);
        return () => unsubscribe();
    }, [eventHub, props.id]);


    const handlePopupOpen = () => { dispatch(turnOnSpotlightSelect(props.id)) }
    const handlePopupClose = () => { dispatch(turnOffSpotlightClose()) }
    const markerEventsHandlers: LeafletEventHandlerFnMap = {
        mouseover: () => {
            dispatch(turnOnSpotlightHover(props.id));
        },
        mouseout: () => {
            if (popupRef.current && !popupRef.current.isOpen()) {
                dispatch(turnOffSpotlightBlur());
            }
        }
    }

    return (
        <Marker
            position={[props.position.x, props.position.y]}
            icon={markerIcon}
            title={props.name}
            eventHandlers={markerEventsHandlers}
            ref={markerRef}
        >
            <Popup
                ref={popupRef}
                onOpen={handlePopupOpen}
                onClose={handlePopupClose}                
            >
                <PopupBody markerId={props.id} />
            </Popup>
        </Marker>
    );
}

export { AreaMarkerReview };

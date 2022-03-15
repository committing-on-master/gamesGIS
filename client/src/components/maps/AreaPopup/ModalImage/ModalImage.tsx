import React, { KeyboardEventHandler, useEffect, useState, WheelEventHandler } from "react";

interface ModalImageProp {
    imgUrl: string;
    onClose(): void;
}
function ModalImage(props: ModalImageProp) {
    const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
    const [dragging, setDragging] = useState({ active: false, prevX: 0, prevY: 0 });

    useEffect(() => {
        const keyPressHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                props.onClose();
            }
        }
        window.addEventListener("keydown", keyPressHandler);
        return () => {
            window.removeEventListener("keydown", keyPressHandler)
        }
    }, [props])

    const mouseWheelHandler = (e: React.WheelEvent<HTMLImageElement>) => {
        const zoomStep = 0.005;
        const maxZoomIn = 0.5;
        const maxZoomOut = 4;

        const delta = e.deltaY * -zoomStep;
        let newScale = position.scale + delta;
        if (newScale < maxZoomIn) { newScale = maxZoomIn; }
        if (newScale > maxZoomOut) { newScale = maxZoomOut; }

        const ratio = 1 - newScale / position.scale;
        setPosition({
            scale: newScale,
            x: position.x + (e.clientX - position.x) * ratio,
            y: position.y + (e.clientY - position.y) * ratio,
        });
    }

    const onDraggingBegin = (e: React.MouseEvent<HTMLImageElement>) => {
        setDragging({
            active: true,
            prevX: e.clientX,
            prevY: e.clientY
        });
    }
    const onDraggingEnd = () => {
        setDragging({ ...dragging, active: false });
    }

    const mouseDragHandler = (e: React.MouseEvent<HTMLImageElement>) => {
        if (dragging.active) {
            const deltaX = e.clientX - dragging.prevX;
            const deltaY = e.clientY - dragging.prevY;

            setPosition({
                ...position,
                x: position.x + deltaX,
                y: position.y + deltaY
            })
            setDragging({
                ...dragging,
                prevX: e.clientX,
                prevY: e.clientY
            });
        }
    }

    return (
        <div className="modal-area-image">
            <span onClick={() => props.onClose()}>&times;</span>
            <img
                src={props.imgUrl}
                alt="area fullsize img"
                onWheel={mouseWheelHandler}

                onMouseDown={onDraggingBegin}
                onMouseMove={mouseDragHandler}
                onMouseUp={() => onDraggingEnd()}
                onMouseOut={() => onDraggingEnd()}

                draggable={false}
                style={{
                    transformOrigin: "0 0",
                    transform: `translate(${position.x}px, ${position.y}px) scale(${position.scale})`,
                }}
            />
        </div>
    )
}

export { ModalImage }

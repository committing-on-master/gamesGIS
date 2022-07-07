import React, { useEffect, useRef } from 'react';
import { Area } from './area';
import styles from './FilledArea.module.scss';

type FilledAreaProps = {
    width: number;
    height: number;

    areas: Area[];
}

function drawArea(context: CanvasRenderingContext2D, area: Area) {
    if (area.points.length > 3) {
        context.beginPath();
        context.moveTo(area.points[0].x, area.points[0].y);
        for (let index = 1; index < area.points.length; ++index) {
            context.lineTo(area.points[index].x, area.points[index].y);
        }
        context.fillStyle = area.colorRGBA;
        context.fill();
    }
}

function FilledArea(props: FilledAreaProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context?.clearRect(0, 0, props.width, props.height);

            if (context && props.areas.length !== 0) {
                props.areas.forEach(area => {
                    drawArea(context, area);
                });
            }
        }
    }, [props.areas, props.height, props.width])
    
    return (
        <canvas
            ref={canvasRef}
            className={styles.areaCanvas}
            width={props.width}
            height={props.height}
        ></canvas>
    );
}

export { FilledArea };

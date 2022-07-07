import React, { MouseEvent } from 'react';
import styles from './MarkerIcon.module.scss';
import { MarkerPopupProps } from './MarkerPopup/MarkerPopup';

type PositionProps = Required<Pick<React.CSSProperties, "top" | "left">>;

type MarkerIconProps = {
    iconUrl: string;
    width: number;
    height: number;

    onClick(): void | undefined;
    onMouseEnter(): void | undefined;
    onMouseLeave(): void | undefined;

    popUp?: React.ReactElement<MarkerPopupProps>;
}

function MarkerIcon({
    height = 30,
    width = 30,
    top = 0,
    left = 0,
    ...props }: MarkerIconProps & PositionProps) {
    const handleMouseClick = (e: MouseEvent<HTMLImageElement>) => {
        if (props.onClick) {
            props.onClick();
        }
    }
    const handleMouseEnter = (e: MouseEvent<HTMLImageElement>) => {
        if (props.onMouseEnter) {
            props.onMouseEnter();
        }
    }
    const handleMouseLeave = (e: MouseEvent<HTMLImageElement>) => {
        if (props.onMouseLeave) {
            props.onMouseLeave();
        }
    }

    return (
        <div 
            className={styles.container}
            style={{left: left, top: top}}
        >
            {props.popUp ? props.popUp : null}
            <img
                className={styles.icon}
                
                src={props.iconUrl}
                height={height}
                width={width}
                alt='icon'
                onClick={handleMouseClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        </div>
    );
}

export { MarkerIcon };

import React, { useEffect, useRef, ReactChild, useState } from 'react';
import { EndPoints } from '../../../api/endPoints';
import { FilledArea } from './FilledArea';
import styles from './InteractiveView.module.scss';
import { MarkerIcon } from './MarkerIcon';
import { PointOfInterest } from './pointOfInterest';

type InteractiveViewProps = {
    width: number;
    height: number;
    imgUrl: string;
    
    points: PointOfInterest[];
}

function InteractiveView({width = 900, height = 900, ...props}: InteractiveViewProps) {
    const [popupVisibilityIndex, setPopupVisibilityIndex] = useState<number | undefined>(undefined);
    
    const content = props.points.map((value, index) => {
        const result = [
            <MarkerIcon
                    key={index}
                    iconUrl={props.imgUrl}
                    width={30}
                    height={30}
                    left={value.location.x}
                    top={value.location.y}

                    onClick={() => setPopupVisibilityIndex(index)}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                />
        ];
        if (index === popupVisibilityIndex) {
            result.push(
                <FilledArea 
                    height={height}
                    width={width}
                    areas={[value.area]}
                />
            );
        }
        return result;
    })
    debugger;
    return (
        <div className={styles.viewContainer}>
            <img 
                className={styles.background}
                src={props.imgUrl}
                alt='maps fragment ...'
                width={width}
                height={height}
            />
            {content}
        </div>
    );
}

export { InteractiveView };

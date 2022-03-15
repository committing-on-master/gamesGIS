import React, { useState } from 'react';
import { MapType } from '../../../api/dto/types/MapType';

import styles from './AreaChoicer.module.scss';

export type ChoicerAreaType = {
    name: string;
    url: string;
    map: MapType
}

interface AreaChoicerProps {
    areas: ChoicerAreaType[];
    onChoiseChanged(chosenMap: MapType): void;
}

function AreaChoicer(props: AreaChoicerProps) {
    const [choiseIndex, setChoiseIndex] = useState(0);
    const handleNext = () => {
        if (choiseIndex < props.areas.length - 1) {
            const newIndex = choiseIndex + 1;
            setChoiseIndex(newIndex);
            props.onChoiseChanged(props.areas[newIndex].map);
        } else {
            const newIndex = 0;
            setChoiseIndex(newIndex);
            props.onChoiseChanged(props.areas[newIndex].map);
        }

    }
    const handlPrevious = () => {
        if (choiseIndex > 0) {
            const newIndex = choiseIndex - 1;
            setChoiseIndex(newIndex);
            props.onChoiseChanged(props.areas[newIndex].map);
        } else {
            const newIndex = props.areas.length - 1;
            setChoiseIndex(newIndex);
            props.onChoiseChanged(props.areas[newIndex].map);
        }
    }

    const leftArrowCss = `${styles.arrow} ${styles.arrowLeft}`;
    const rightArrowCss = `${styles.arrow} ${styles.arrowRight}`;
    return (
        <div className={styles.container}>
            <img 
                className={styles.image}
                src={props.areas[choiseIndex].url}
                alt="Simple area preview"
                width={540}
                height={301}
            />
            <div className={styles.areaNameContainer}>
                <span className={styles.areaName}>{props.areas[choiseIndex].name}</span>
            </div>
            <span className={leftArrowCss} onClick={handlPrevious}>&#10094;</span>
            <span className={rightArrowCss} onClick={handleNext}>&#10095;</span>
        </div>
    );
}

export { AreaChoicer };

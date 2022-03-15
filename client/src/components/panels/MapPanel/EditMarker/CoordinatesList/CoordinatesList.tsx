import React from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { selectEditableCoordinates } from '../../../../../store/markers/slice';

import styles from './CoordinatesList.module.scss';


function CoordinatesList() {
    const list = useAppSelector(state => selectEditableCoordinates(state.markers));
    
    let listBody: React.ReactNode;

    if (!list || list.length === 0) {
        listBody = <li>There is no coordinates</li>
    } else {
        listBody = list.map((value, index) => {
            const textBoxy = `x: ${value.x.toFixed(3)} y: ${value.y.toFixed(3)}`;
            return <li key={index}>{textBoxy}</li>
        })
    }

    return <ul className={styles.list_item}>{listBody}</ul>;
}

export { CoordinatesList };

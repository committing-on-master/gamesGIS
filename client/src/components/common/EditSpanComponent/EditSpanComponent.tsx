import classNames from 'classnames';
import React from 'react';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styles from './EditSpanComponent.module.scss';

type EditSpanComponentProps = {
    id: number,
    onClick(markerId: number): void,
    className?: string
}

function EditSpanComponent(props: EditSpanComponentProps) {
    const iconCss = `${styles.edit} fa-xs`;
    const spanCss = props.className ? `${props.className} ${styles.component}` : styles.component;

    return (
        <span
            className={spanCss}
            onClick={() => props.onClick(props.id)}
        >
            <FontAwesomeIcon className={iconCss} icon={faEdit} />
        </span>
    );
}

export { EditSpanComponent };

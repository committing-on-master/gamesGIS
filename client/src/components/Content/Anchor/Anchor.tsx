import React, { MouseEvent } from 'react';
import styles from './Anchor.module.scss';

type AnchorProps = {
    text: string;
    onClick(): void | undefined;
    onMouseEnter(): void | undefined;
    onMouseLeave(): void | undefined;
}

function Anchor(props: AnchorProps) {
    const handleMouseClick = (e: MouseEvent) => {
        if (props.onClick) {
            props.onClick();
        }
    }
    const handleMouseEnter = (e: MouseEvent) => {
        if (props.onMouseEnter) {
            props.onMouseEnter();
        }
    }
    const handleMouseLeave = (e: MouseEvent) => {
        if (props.onMouseLeave) {
            props.onMouseLeave();
        }
    }
    return (
        <span
            css={styles.anchor}
            onClick={handleMouseClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            >            
            {props.text}
        </span>
    );
}

export { Anchor };

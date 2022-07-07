import React from 'react';
import styles from './MarkerPopup.module.scss';

type MarkerPopupProps = {
    header: string;
    text: string;
    onClose(): void | undefined;
}

function MarkerPopup(props: MarkerPopupProps) {
    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    }
    return (
        <div className={styles.container}>
            <div className={styles.content}>
            <h1 
                className={styles.header}
            >{props.header}</h1>
            
            <p
                className={styles.text}
            >{props.text}</p>
            </div>

            <div className={styles.tipContainer}>
                <div className={styles.tip}></div>
            </div>

            <button
                className={styles.close}
                onClick={handleClose}
            >×</button>
        </div>
    );
}

export { MarkerPopup, type MarkerPopupProps };

import React from 'react';
import { ProcessState } from '../../../../hocs/withWaiter';

import styles from './LicenseAgreement.module.scss';

type LicenseAgreementProps = {
    children: React.ReactChild;
    onCancel: () => void;
    onConfirm: () => void;
    state: ProcessState;
}

function LicenseAgreement(props: LicenseAgreementProps) {
    const contentLoading = props.state !== ProcessState.Succeeded;
    return (
        <div className={styles.shadow}>
            <div className={styles.licenseContainer}>
                <header className={styles.header}>
                    <h2>License agreement</h2>
                    <button 
                        className={`${styles.button} ${styles.buttonClose}`}
                        aria-label="close" onClick={props.onCancel}
                    >×</button>
                </header>
                <div className={styles.body}>
                    {props.children}
                </div>
                <footer className={styles.footer}>
                    <button
                        className={`${styles.button} ${styles.buttonAgree}`}
                        disabled={contentLoading}
                        onClick={props.onConfirm}
                    >
                        Agree
                    </button>
                    <button 
                        className={`${styles.button} ${styles.buttonDisagree}`}
                        onClick={props.onCancel}
                    >
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
}

export { LicenseAgreement };

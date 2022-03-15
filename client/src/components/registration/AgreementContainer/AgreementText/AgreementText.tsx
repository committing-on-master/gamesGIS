import React from 'react';

import styles from './AgreementText.module.scss';

export type AgreementTextProps = {
    text: string
}

function AgreementText(props: AgreementTextProps) {
    return (
        <article className={styles.agreement}>
            {props.text}
        </article>
    );
}

export { AgreementText };

import React from 'react';

import './AgreementText.scss';

export type AgreementTextProps = {
    text: string
}

function AgreementText(props: AgreementTextProps) {
    return (
        <article className='agreement-text'>
            {props.text}
        </article>
    );
}

export { AgreementText };

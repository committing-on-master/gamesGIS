import React from 'react';
import classNames from 'classnames';

import { withWaiter, ProcessState } from '../../../hocs/withWaiter';
import { AgreementText } from './AgreementText';
import { useFetchLicenseText } from './hooks';
import { LicenseAgreement } from './LicenseAgreement';

const Content = withWaiter(AgreementText);

type AgreementContainerProps = {
    onCancel: () => void;
    onConfirm: () => void;
}

function AgreementContainer(props: AgreementContainerProps) {
    const [state, text] = useFetchLicenseText();

    return (
        <LicenseAgreement 
            onCancel={props.onCancel}
            onConfirm={props.onConfirm}
            state={state}
        >
            <Content state={state} msg={text} text={text} size={'large'}/>
        </LicenseAgreement>
    );
}

export { AgreementContainer };

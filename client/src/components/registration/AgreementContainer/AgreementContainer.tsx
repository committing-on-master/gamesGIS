import React from 'react';
import classNames from 'classnames';

import { withWaiter, ProcessState, useFetchingData } from '../../../hocs/withWaiter';
import { AgreementText } from './AgreementText';
import { useFetchLicenseText } from './hooks';
import { LicenseAgreement } from './LicenseAgreement';
import { AgreementDTO } from '../../../api/dto/response/AgreementDTO';

const Content = withWaiter(AgreementText);

type AgreementContainerProps = {
    onCancel: () => void;
    onConfirm: () => void;
}

function AgreementContainer(props: AgreementContainerProps) {
    const [state, text, response] = useFetchingData<AgreementDTO>('agreement');

    return (
        <LicenseAgreement 
            onCancel={props.onCancel}
            onConfirm={props.onConfirm}
            state={state}
        >
            <Content waiterState={state} waiterMsg={text} text={response?.payload?.agreementText} waiterSize={'large'}/>
        </LicenseAgreement>
    );
}

export { AgreementContainer };

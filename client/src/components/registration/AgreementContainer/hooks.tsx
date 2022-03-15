import { useEffect, useState } from 'react';
import { AgreementDTO } from '../../../api/dto/response/AgreementDTO';
import { RequestWrapper } from '../../../api/JsonRequestWrapper';
import { ProcessState } from '../../../hocs/withWaiter';

function useFetchLicenseText(): [ProcessState, string] {
    const [text, setText] = useState('Loading text agreement...');
    const [loadingState, setLoadingState] = useState<ProcessState>(ProcessState.Loading);

    useEffect(() => {
        RequestWrapper.endPoint('agreement').get().send<AgreementDTO>()
            .then(response => {
                if (response.ok && response.success) {
                    setLoadingState(ProcessState.Succeeded);
                    setText(response.success?.payload?.agreementText);
                } else {
                    switch (response.code) {
                        case 404:
                            setLoadingState(ProcessState.Failed);
                            setText("License agreement not found on server.");
                            break;
                        default:
                            console.log(`response code: ${response.code}`)
                            console.log(response.failure);
                            setLoadingState(ProcessState.Failed);
                            setText("Server makes \"Oops\". Please try again later ¯\\_(ツ)_/¯");
                            break;
                    }
                }
            })
            .catch(error => {
                console.log(error);
                setLoadingState(ProcessState.Failed);
                setText("Network connection error");
            })
    }, [])

    return [loadingState, text];
}

export { useFetchLicenseText }
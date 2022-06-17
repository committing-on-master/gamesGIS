import React, { useEffect, useState } from "react";
import { SuccessResponse } from "../api/dto/SuccessResponse";
import { RequestWrapper } from "../api/JsonRequestWrapper";
import { AwaitingComponent } from "../components/common/AwaitingComponent";
import { WarningComponent } from "../components/common/WarningComponent";

export enum ProcessState {
    Idle = 0,
    Loading,
    Succeeded,
    Failed
}

type WaiterProps = {
    waiterState: ProcessState;
    waiterMsg?: React.ReactChild;
    waiterSize?: "small" | "medium" | "large";
};

function withWaiter<T>(
    WrappedComponent: React.ComponentType<T>
) {
    return ({ waiterState, waiterMsg, waiterSize, ...hocProps }: Partial<T> & WaiterProps) => {
        switch (waiterState) {
            case ProcessState.Loading: {
                return (
                    <AwaitingComponent size={waiterSize}>
                        {waiterMsg ? waiterMsg : null}
                    </AwaitingComponent>
                );
            }
            case ProcessState.Failed: {
                return (
                    <WarningComponent size={waiterSize}>
                        {waiterMsg ? waiterMsg : null}
                    </WarningComponent>
                );
            }
            case ProcessState.Succeeded: {
                // const [] = ...hocProps;
                // if (hocProps)
                return (
                    <WrappedComponent {...hocProps as unknown as T} />
                );
                // break;
            }
            case ProcessState.Idle:
            default: {
                console.log("Nothing to render inside withWaiter hoc");
                return (null);
            }
        }
    }
}

function useFetchingData<Response extends SuccessResponse>(endPoint: string): [ProcessState, string, Response | undefined] {
    const [text, setText] = useState('Loading, please wait...');
    const [responseData, setResponseData] = useState<Response>();
    const [loadingState, setLoadingState] = useState<ProcessState>(ProcessState.Loading);

    useEffect(() => {
        RequestWrapper.endPoint(endPoint).get().send<Response>()
            .then(response => {
                if (response.ok && response.success) {
                    setResponseData(response.success);
                    setLoadingState(ProcessState.Succeeded);
                } else {
                    switch (response.code) {
                        case 404:
                            setLoadingState(ProcessState.Failed);
                            setText("Data not found on server.");
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
    }, [endPoint])

    return [loadingState, text, responseData];
}

export { withWaiter, useFetchingData };

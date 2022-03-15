import React from "react";
import { AwaitingComponent } from "../components/common/AwaitingComponent";
import { WarningComponent } from "../components/common/WarningComponent";

export enum ProcessState {
    Idle = 0,
    Loading,
    Succeeded,
    Failed
}

type WaiterProps = {
    state: ProcessState;
    msg?: React.ReactChild;
    size?: "small" | "medium" | "large";
};

function withWaiter<T>(
    WrappedComponent: React.ComponentType<T>
) {
    return (hocProps: T & WaiterProps) => {
        switch (hocProps.state) {
            case ProcessState.Loading: {
                return (
                    <AwaitingComponent size={hocProps.size}>
                        {hocProps.msg ? hocProps.msg : null}
                    </AwaitingComponent>
                );
            }
            case ProcessState.Failed: {
                return (
                    <WarningComponent size={hocProps.size}>
                        {hocProps.msg ? hocProps.msg : null}
                    </WarningComponent>
                );
            }
            case ProcessState.Succeeded: {
                return (
                    <WrappedComponent {...hocProps}/>
                );
            }
            case ProcessState.Idle:
            default: {
                console.log("Nothing to render inside withWaiter hoc");
                return (null);
            }
        }
    }
}

export { withWaiter };

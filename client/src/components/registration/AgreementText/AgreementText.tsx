import { useEffect, useState } from "react";
import { RequestWrapper } from "./../../../api/JsonRequestWrapper";
import { AgreementDTO } from "./../../../api/dto/response/AgreementDTO";
import { AwaitingComponent } from "./../../common/AwaitingComponent";
import { WarningComponent } from "./../../common/WarningComponent";

import "./AgreementText.scss";

interface AgreementTextProps {
    endPoint: string;
    onTextLoaded(): void;
}

type LoadingStatus = "loading" | "loaded" | "failed";


function AgreementText(props: AgreementTextProps) {
    const [componentStatus, setComponentStatus] = useState<LoadingStatus>("loading");
    const [text, setText] = useState("Loading agreement text...");

    useEffect(() => {
        RequestWrapper.endPoint(props.endPoint).get().send<AgreementDTO>()
            .then(response => {
                if (response.ok && response.success) {
                    setComponentStatus("loaded");
                    console.log(response.success?.payload?.agreementText);
                    setText(response.success?.payload?.agreementText);
                    props.onTextLoaded();
                } else {
                    switch (response.code) {
                        case 404:
                            setComponentStatus("failed");
                            setText("License agreement not found on server.");
                            break;
                        default:
                            console.log(`response code: ${response.code}`)
                            console.log(response.failure);
                            setComponentStatus("failed");
                            setText("Server makes \"Oops\". Please try again later ¯\\_(ツ)_/¯");
                            break;
                    }
                }
            })
            .catch(error => {
                console.log(error);
                setComponentStatus("failed");
                setText("Network connection error");
            })


    }, [props, props.endPoint])

    let content: JSX.Element;

    switch (componentStatus) {
        case "loading":
            content =
                <AwaitingComponent size="large">
                    <p>{text}</p>
                </AwaitingComponent>
            break;
        case "loaded":
            content = <div className="agreement-text">{text}</div>;
            break;
        default:
            content =
                <WarningComponent size="large">
                    <p>{text}</p>
                </WarningComponent>
            break;
    }

    return (
        <>
            {content}
        </>
    );
}

export { AgreementText }
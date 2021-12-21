import { useEffect, useState } from "react";
import { RequestWrapper } from "./../../api/JsonRequestWrapper";
import { AgreementDTO } from "../../api/dto/response/AgreementDTO";
import { AwaitingComponent } from "../AwaitingComponent";
import { WarningComponent } from "../WarningComponent";

interface AgreementTextProps {
    endPoint: string;
    onTextLoaded(): void;
}

type LoadingStatus = "loading" | "loaded" | "failed";


function AgreementText(props: AgreementTextProps) {
    const [componentStatus, setComponentStatus] = useState<LoadingStatus>("loading");
    const [text, setText] = useState("Loading agreement text...");

    useEffect(() => {
        RequestWrapper.get<AgreementDTO>(props.endPoint)
            .then(response => {
                if (response.ok && response.success) {
                    setComponentStatus("loaded");
                    setText(response.success?.payload?.agreementText);
                    props.onTextLoaded();
                    return Promise.resolve();
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
                <AwaitingComponent>
                    <p>{text}</p>
                </AwaitingComponent>
            break;
        case "loaded":
            content = <div className="content">{text}</div>;
            break;
        default:
            content =
                <WarningComponent>
                    <p>{text}</p>
                </WarningComponent>
            break;
    }

    return (
        <section className="modal-card-body">
            {content}
        </section>);
}

export { AgreementText }
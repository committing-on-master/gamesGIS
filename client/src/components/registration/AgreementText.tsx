import { useEffect, useState } from "react";
import { RequestWrapper } from "./../../api/JsonRequestWrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { AgreementDTO } from "../../api/dto/response/AgreementDTO";

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
                <div className="content has-text-centered">
                    <FontAwesomeIcon className="icon is-large fa-pulse" icon={faSpinner} />
                    <p>{text}</p>
                </div>
            break;
        case "loaded":
            content = <div className="content">{text}</div>;
            break;
        default:
            content =
                <div className="content has-text-centered">
                    <FontAwesomeIcon className="icon is-large" icon={faExclamationTriangle} />
                    <p>{text}</p>
                </div>
            break;
    }
    
    return (
        <section className="modal-card-body">
            {content}
        </section>);
}

export { AgreementText }
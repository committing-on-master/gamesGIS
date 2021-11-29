import { useEffect, useState } from "react";
import { RequestWrapper } from "./../../api/JsonRequestWrapper";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { agreementDto } from "../../api/dto/agreementDto";
import { iSuccessResponse } from "../../api/dto/iSuccessResponse";

interface AgreementTextProps {
    endPoint: string;
    onLoaded(): void;
}

type LoadingStatus = "loading" | "loaded" | "failed";

function AgreementText(props: AgreementTextProps) {
    const [componentStatus, setComponentStatus] = useState<LoadingStatus>("loading");
    const [text, setText] = useState("Loading agreement text...");

    useEffect(() => {
        RequestWrapper.get<iSuccessResponse<agreementDto>, {}>(props.endPoint)
            .then(response => {
                if (response.ok && response.successBody) {
                    setComponentStatus("loaded");
                    setText(response.successBody.payload.agreementText);
                    props.onLoaded();
                    return Promise.resolve();
                } else {
                    switch (response.code) {
                        case 404:
                            setComponentStatus("failed");
                            setText("License agreement not found on server.");
                            break;
                        default:
                            console.log(`response code: ${response.code}`)
                            console.log(response.errorBody);
                            setComponentStatus("failed");
                            setText("Server makes \"Ooops\". Please try again later ¯\\_(ツ)_/¯");
                            break;
                    }
                }
            })
            .catch(error => {
                console.log(error);
                setComponentStatus("failed");
                setText("Network connection error");
            })


    }, [])

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
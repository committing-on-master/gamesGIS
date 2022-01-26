import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames";

import "./AwaitingComponent.scss"

interface AwaitingComponentProps {
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
}

export function AwaitingComponent(props: AwaitingComponentProps) {
    const cssClass = classNames(
        "fas-await",
        "fa-pulse",
        {
            "fa-xs": props.size === "small",
            "fa-1x": props.size === "medium",
            "fa-5x": props.size === "large",
        }
    );
    return (
        <div>
            <FontAwesomeIcon className={cssClass} icon={faSpinner} />
            {props.children ?? props.children}
        </div>
    );
}

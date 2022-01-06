import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import "./WarningComponent.scss";

interface WarningComponentProps {
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
}

export function WarningComponent({size = "medium", ...props}: WarningComponentProps) {
    const cssClass = classNames(
        "fas-warn",
        {
            "fa-xs": size === "small",
            "fa-1x": size === "medium",
            "fa-5x": size === "large",
        }
    );
    return (
        <div>
            <FontAwesomeIcon className={cssClass} icon={faExclamationTriangle} />
            {props.children ?? props.children}
        </div>
    );
}

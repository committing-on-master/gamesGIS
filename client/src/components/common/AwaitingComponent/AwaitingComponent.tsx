import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames";

import "./AwaitingComponent.scss"

interface AwaitingComponentProps {
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
}

export function AwaitingComponent({ size = "medium", ...props }: AwaitingComponentProps) {
    const componentCss = classNames(
        "component-awaiting",
        {
            "component-awaiting--inline": size === "small"
        }
    );

    const iconCss = classNames(
        "fas-await",
        "fa-pulse",
        {
            "fa-xs": size === "small",
            "fas-await--inline": size === "small",
            "fa-1x": size === "medium",
            "fa-5x": size === "large",
        }
    );
    return (
        <div className={componentCss}>
            <FontAwesomeIcon className={iconCss} icon={faSpinner} />
            {props.children ?? props.children}
        </div>
    );
}

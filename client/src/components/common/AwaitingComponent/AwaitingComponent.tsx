import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import classNames from "classnames";

import styles from './AwaitingComponent.module.scss';

interface AwaitingComponentProps {
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
}

export function AwaitingComponent({ size = "medium", ...props }: AwaitingComponentProps) {
    const componentCss = classNames(
        styles.component,
        {
            [styles.component_inline]: size === "small"
        }
    );

    const iconCss = classNames(
        styles.await,
        "fa-pulse",
        {
            "fa-xs": size === "small",
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

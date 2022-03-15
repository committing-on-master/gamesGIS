import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

import styles from './WarningComponent.module.scss';

interface WarningComponentProps {
    size?: "small" | "medium" | "large";
    children?: React.ReactNode;
}

export function WarningComponent({ size = "medium", ...props }: WarningComponentProps) {
    const componentCss = classNames(
        styles.component,
        {
            [styles.component_inline]: size === "small"
        }
    );
    const iconCss = classNames(
        styles.icon,
        {
            "fa-xs": size === "small",
            "fa-1x": size === "medium",
            "fa-5x": size === "large",
        }
    );
    return (
        <div className={componentCss}>
            <FontAwesomeIcon className={iconCss} icon={faExclamationTriangle} />
            {props.children ?? props.children}
        </div>
    );
}

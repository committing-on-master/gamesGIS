import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface WarningComponentProps {
    children?: React.ReactNode;
}

export function WarningComponent(props: WarningComponentProps) {
    return (
        <div className="content has-text-centered">
            <FontAwesomeIcon className="icon is-large" icon={faExclamationTriangle} />
            {props.children ?? props.children}
        </div>
    );
}

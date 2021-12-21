import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

interface AwaitingComponentProps {
    children?: React.ReactNode;
}

export function AwaitingComponent(props: AwaitingComponentProps) {
    return (
        <div className="content has-text-centered">
            <FontAwesomeIcon className="icon is-large fa-pulse" icon={faSpinner} />
            {props.children ?? props.children}
        </div>
    );
}

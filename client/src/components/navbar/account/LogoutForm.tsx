import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '../../../store/hooks'
import { logoutUser } from '../../../store/account/thunks';

interface LogoutProps {
    onSuccessfullyProcess?(): void;
}

function LogoutForm(props: LogoutProps) {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
        if (props.onSuccessfullyProcess) {
            props.onSuccessfullyProcess();
        }
    }

    return (
        <div className="p-3">

            <a href="#" className="dropdown-item">
                <span className="icon is-small">
                    <FontAwesomeIcon icon={faUserCog} />
                </span>
                <span> Settings</span>
            </a>

            <hr className="dropdown-divider" />

            <div className="dropdown-item">
                <button className="button is-link" onClick={handleLogout} >
                    <span className="icon is-small">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </span>
                    <span>
                        Logout
                    </span>
                </button>
            </div>
        </div>
    )
}

export { LogoutForm }

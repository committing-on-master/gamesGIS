import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '../../../../store/hooks'
import { logoutUser } from '../../../../store/account/thunks';
import { Link } from 'react-router-dom';

import "./LogoutForm.scss";

interface LogoutProps {
    onLogout?(): void;
}

function LogoutForm(props: LogoutProps) {
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
        if (props.onLogout) {
            props.onLogout();
        }
    }

    return (
        <div className="logout-form">
            <Link to={"/profile"}>Profile</Link>
            <hr />
            <button className="button button-danger" onClick={handleLogout}>
                <span className="icon">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                Logout
            </button>
        </div>
    )
}

export { LogoutForm }

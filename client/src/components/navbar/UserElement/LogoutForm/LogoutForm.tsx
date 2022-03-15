import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '../../../../store/hooks'
import { logoutUser } from '../../../../store/account/thunks';
import { Link, useNavigate } from 'react-router-dom';

import styles from './LogoutForm.module.scss';

interface LogoutProps {
    onLogout?(): void;
}

function LogoutForm(props: LogoutProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser());
        if (props.onLogout) {
            props.onLogout();
        }
        navigate("/", {replace: true});
    }

    return (
        <div className="logout-form">
            <Link to={"/profile"}>Profile</Link>
            <hr />
            <button className={styles.button} onClick={handleLogout}>
                <span className={styles.icon}>
                    <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                Logout
            </button>
        </div>
    )
}

export { LogoutForm }

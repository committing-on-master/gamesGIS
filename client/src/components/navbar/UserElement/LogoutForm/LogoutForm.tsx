import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch } from '../../../../store/hooks'
import { logoutUser } from '../../../../store/account/thunks';
import "./LogoutForm.scss";
import { Button } from '../../../Button';
import { Link } from 'react-router-dom';

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
        <div className="logout-form">
            <Link to={"/profile"}>Profile</Link>
            <hr/>
            <span className="icon is-small">
                <FontAwesomeIcon icon={faSignOutAlt} />
            </span>
            <Button size='small' label="Logout" onClick={handleLogout}/>
            {/* <a href="#" className="dropdown-item">
                <span className="icon is-small">
                    <FontAwesomeIcon icon={faUserCog} />
                </span>
                <span> Settings</span>
            </a>

            <div>
                <button className="button is-link" onClick={handleLogout} >
                    <span className="icon is-small">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                    </span>
                    <span>
                        Logout
                    </span>
                </button>
            </div> */}
        </div>
    )
}

export { LogoutForm }

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUserCog } from '@fortawesome/free-solid-svg-icons'

function LogoutForm() {
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
                <button className="button is-link">
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

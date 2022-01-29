import { useNavigate } from 'react-router';
import { Inputs, RegistrationForm } from '../components/registration/RegistrationForm/RegistrationForm';
import { LicenseAgreement } from './../components/registration/LicenseAgreement';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/account/thunks';

function RegistrationPage() {
    const dispatch = useAppDispatch();
    const routerNav = useNavigate();

    function handleCancel() {
        routerNav("/")
    }
    function handleRegistration(data: Inputs) {
        dispatch(loginUser({userEmail: data.userEmail, userPassword: data.userPassword}))
            .unwrap()
            .then(() => {
                routerNav("howto");
            });
    }

    return (
        <article className="container is-max-desktop message is-info">
            <LicenseAgreement endPoint="agreement" onCancel={handleCancel} />
            <div className="message-header">
                <p>Registration form</p>
            </div>
            <div className="message-body">
                <RegistrationForm endPoint="users" onRegistered={handleRegistration}/>
            </div>
        </article>
    )
}

export { RegistrationPage }

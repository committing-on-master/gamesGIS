import { useNavigate } from 'react-router';
import { Inputs, RegistrationForm } from '../components/registration/RegistrationForm';
import { LicenseAgreement } from './../components/registration/LicenseAgreement';

interface RegistrationPageProps {

}

function RegistrationPage(props: RegistrationPageProps) {
    const routerNav = useNavigate();

    function handleCancel() {
        routerNav("/")
    }
    function handleRegistration(data: Inputs) {
        
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
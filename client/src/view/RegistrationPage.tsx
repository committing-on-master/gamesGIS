import { RegistrationForm } from '../components/registration/RegistrationForm';
import { LicenseAgreement } from './../components/registration/LicenseAgreement';

interface RegistrationPageProps {

}

function RegistrationPage(props: RegistrationPageProps) {
    function handleConfirm() {

    }

    function handleCancel() {

    }

    return (
        <article className="container is-max-desktop message is-info">
            <div className="message-header">
                <p>Registration form</p>
            </div>
            <div className="message-body">
                <LicenseAgreement endPoint="agreement" onConfirm={handleConfirm} onCancel={handleCancel} />
                <RegistrationForm endPoint="users"/>
            </div>
        </article>
    )
}

export { RegistrationPage }
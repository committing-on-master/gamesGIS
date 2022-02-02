import { useNavigate } from 'react-router';
import { Inputs, RegistrationForm } from '../components/registration/RegistrationForm/RegistrationForm';
import { LicenseAgreement } from './../components/registration/LicenseAgreement';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/account/thunks';
import { useState } from 'react';

import "./RegistrationPage.scss";

function RegistrationPage() {
    const [confirmation, setConfirmation] = useState(true);
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
        <div className="registration-container">
            { confirmation && <LicenseAgreement endPoint="agreement" onCancel={handleCancel} onConfirm={() => setConfirmation(false)} /> }
            <h2>Registration form</h2>
            <div className="message-body">
                <RegistrationForm endPoint="users" onRegistered={handleRegistration}/>
            </div>
        </div>
    )
}

export { RegistrationPage }

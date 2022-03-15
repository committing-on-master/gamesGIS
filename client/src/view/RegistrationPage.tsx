import { useNavigate } from 'react-router';
import { Inputs, RegistrationForm } from '../components/registration/RegistrationForm/RegistrationForm';
import { AgreementContainer } from './../components/registration/AgreementContainer';
import { useAppDispatch } from '../store/hooks';
import { loginUser } from '../store/account/thunks';
import { useState } from 'react';

import styles from './RegistrationPage.module.scss';

function RegistrationPage() {
    const [confirmation, setConfirmation] = useState(true);
    const dispatch = useAppDispatch();
    const routerNav = useNavigate();

    function handleCancel() {
        routerNav("/", {replace: true});
    }
    
    function handleRegistration(data: Inputs) {
        dispatch(loginUser({userEmail: data.userEmail, userPassword: data.userPassword}))
            .unwrap()
            .then(() => {
                routerNav("/mymaps", {replace: true});
            });
    }

    return (
        <div className={styles.container}>
            { confirmation && <AgreementContainer onCancel={handleCancel} onConfirm={() => setConfirmation(false)} /> }
            <h2>Registration form</h2>
            <RegistrationForm endPoint="users" onRegistered={handleRegistration}/>
        </div>
    )
}

export { RegistrationPage }

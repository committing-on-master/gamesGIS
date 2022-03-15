import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import { SchemaValidation } from "./schemaValidation";
import { useAppDispatch } from "../../../../store/hooks";
import { loginUser } from "../../../../store/account/thunks";
import { ErrorDTO } from "../../../../api/dto/response/ErrorDTO";
import { nameofPropChecker } from "../../../../generics/nameofPropChecker";
import { AuthDTO } from "../../../../api/dto/request/AuthDTO";
import { LinkButton } from "../../../common/LinkButton";

import styles from './LoginForm.module.scss';

type Inputs = {
    userPassword: string,
    userEmail: string
}

interface LoginFormProps {
    onSuccessfullyLogin?(): void;
    onRegistrationRedirect?(): void;
}

function LoginForm(props: LoginFormProps) {
    const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<Inputs>();
    const dispatch = useAppDispatch();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
            dispatch(loginUser({userEmail: data.userEmail, userPassword: data.userPassword}))
                .unwrap()
                .then(res => {
                    if (props.onSuccessfullyLogin) {
                        props.onSuccessfullyLogin();
                    }
                    reset();
                })
                .catch(rejectedErr => { // если только msg - то логин/пароль не верный
                    // если error не пустой, то там ошибки по полям
                    if (rejectedErr.payload) {
                        const errorRes: ErrorDTO = rejectedErr.payload;

                        // ошибки от бэкэнд валидации по конкретным полям
                        if (errorRes.errors && errorRes.errors.length !== 0) {
                            errorRes.errors.forEach((error) => {
                                switch (error.param) {
                                    case nameofPropChecker<AuthDTO>("email"):
                                        setError("userEmail", { message: error.msg }, { shouldFocus: true });                                                                                
                                        break;
                                    case nameofPropChecker<AuthDTO>("password"):
                                        setError("userPassword", { message: error.msg }, { shouldFocus: true});
                                        break;
                                    default:
                                        return Promise.reject(rejectedErr);
                                }
                            })
                            return Promise.resolve();
                        }

                        // с полями все в порядке, не верная пара логин/пароль
                        if (errorRes.message) {
                            setError("userEmail", { message: errorRes.message });
                            setError("userPassword", { message: errorRes.message });
                            return Promise.resolve();
                        }
                    }
                    return Promise.reject(rejectedErr);
                })
    }

    return (
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <label>Email</label>
                    <span className={styles.icon}>
                        <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input className={styles.input} type="email" placeholder="User email ..." {...register("userEmail", SchemaValidation.Email)} />
                    {errors.userEmail && <p className={styles.error}>{errors.userEmail.message}</p>}
                </div>

                <div>
                    <label>Password</label>
                    <span className={styles.icon}>
                        <FontAwesomeIcon icon={faKey} />
                    </span>
                    <input className={styles.input} type="password" placeholder="User password ..." {...register("userPassword", SchemaValidation.Password)} />
                    {errors.userPassword && <p className={styles.error}>{errors.userPassword.message}</p>}
                </div>

                <div className={styles.controls}>
                    <button type="submit" className={styles.buttonPr}>Login</button>
                    <LinkButton className={styles.button} onClick={props.onRegistrationRedirect} to="registration">Registration</LinkButton>
                </div>
            </form>
    )
}

export { LoginForm };
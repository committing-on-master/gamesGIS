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

import "./LoginForm.scss";

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
            <form className="form-login" onSubmit={handleSubmit(onSubmit)}>

                <div className="form-input-block">
                    <label>Email</label>
                    <div className="control">
                        <span className="icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                        <input className="input" type="email" placeholder="User email ..." {...register("userEmail", SchemaValidation.Email)} />
                    </div>
                    {errors.userEmail && <p className="error">{errors.userEmail.message}</p>}
                </div>

                <div className="form-input-block">
                    <label>Password</label>
                    <div className="control">
                        <span className="icon">
                            <FontAwesomeIcon icon={faKey} />
                        </span>
                        <input className="input" type="password" placeholder="User password ..." {...register("userPassword", SchemaValidation.Password)} />
                    </div>
                    {errors.userPassword && <p className="error">{errors.userPassword.message}</p>}
                </div>

                <div className="form-controls">
                    <button type="submit" className="button button--primary">Login</button>
                    <LinkButton className="button" onClick={props.onRegistrationRedirect} to="registration">Registration</LinkButton>
                </div>
            </form>
    )
}

export { LoginForm };
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import { SchemaValidation } from "./../../schemas/schemaValidation";
import { Link } from "react-router-dom";
import { useAppDispatch } from "./../../../store/hooks";
import { loginUser } from "./../../../store/account/thunks";
import { ErrorDTO } from "../../../api/dto/response/ErrorDTO";
import { nameofPropChecker } from "../../../api/nameofPropChecker";
import { AuthDTO } from "../../../api/dto/request/AuthDTO";
import "./LoginForm.scss";

type Inputs = {
    userPassword: string,
    userEmail: string
}

interface LoginFormProps {
    onSuccessfullyLogin?(): void;
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
                        if (errorRes.msg) {
                            setError("userEmail", { message: errorRes.msg });
                            setError("userPassword", { message: errorRes.msg });
                            return Promise.resolve();
                        }
                    }
                    return Promise.reject(rejectedErr);
                })
    }

    return (
        <div className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                        <input className="input" type="email" placeholder="User email ..." {...register("userEmail", SchemaValidation.Email)} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                    </div>
                    {errors.userEmail && <p className="help is-danger">{errors.userEmail.message}</p>}
                </div>


                <div className="field">
                    <label className="label">Password</label>
                    <div className="control has-icons-left">
                        <input className="input" type="password" placeholder="User password ..." {...register("userPassword", SchemaValidation.Password)} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faKey} />
                        </span>
                    </div>
                    {errors.userPassword && <p className="help is-danger">{errors.userPassword.message}</p>}
                </div>

                <div className="control">
                    <button type="submit" className="button is-link">Login</button>
                </div>

            </form>
            <p>Registration form: <Link to="registration">click here</Link></p>
        </div>
    )
}

export { LoginForm };
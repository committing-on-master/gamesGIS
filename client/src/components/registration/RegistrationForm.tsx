import { SubmitHandler, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'

import { SchemaValidation } from "../schemas/schemaValidation";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { iCreateUserDto } from "../../api/dto/iCreateUserDto";
import { iSuccessResponse } from "../../api/dto/iSuccessResponse";
import { useState } from "react";
import { IErrorBody } from "../../api/dto/IErrorBody";
import { nameofPropChecker } from "../../api/nameofPropChecker";

interface RegistrationFormProps {
    onRegistrationEvent?(): void;
    endPoint: string;
}

type Inputs = {
    userEmail: string,
    userName: string,
    userPassword: string,
    userPasswordConfirm: string
}

function RegistrationForm(props: RegistrationFormProps) {
    const { register, handleSubmit, setError, formState: { errors }, watch } = useForm<Inputs>();
    const [unexpectedError, setUnexpectedError] = useState("");

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const requestBody: iCreateUserDto = {
            email: data.userEmail,
            name: data.userName,
            password: data.userPassword
        }

        RequestWrapper.post<iSuccessResponse, IErrorBody>(props.endPoint, requestBody)
            .then(res => {
                if (res.ok) {
                    alert("fuck yeah \\m/");
                    return Promise.resolve();
                }
                switch (res.code) {
                    case 400:
                        res.errorBody?.errors?.forEach(error => {
                            switch (error.param) {
                                case nameofPropChecker<iCreateUserDto>("email"):
                                    setError("userEmail", { message: error.msg }, { shouldFocus: true });
                                    break;
                                case nameofPropChecker<iCreateUserDto>("name"):
                                    setError("userName", { message: error.msg }, { shouldFocus: true });
                                    break;
                                case nameofPropChecker<iCreateUserDto>("password"):
                                    setError("userPassword", { message: error.msg }, { shouldFocus: true });
                                    break;
                                default:
                                    console.log(error);
                                    setUnexpectedError("Unexpected received response error format");
                                    break;
                            }
                        })
                        break;
                    default:
                        console.log(res.errorBody);
                        setUnexpectedError(res.errorBody?.msg || "Unexpected received response error format");
                        break;
                }
                return Promise.resolve();
            })
            .catch((error) => {
                console.log(error);
                setUnexpectedError("Network connection error");
                return Promise.resolve();
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
                    <label className="label">Name</label>
                    <div className="control has-icons-left">
                        <input className="input" type="text" placeholder="User name ..." {...register("userName", SchemaValidation.Name)} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faUser} />
                        </span>
                    </div>
                    {errors.userName && <p className="help is-danger">{errors.userName.message}</p>}
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

                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control has-icons-left">
                        <input className="input" type="password" placeholder="User password ..."
                            {...register("userPasswordConfirm", {
                                validate: fieldValue => {
                                    return fieldValue === watch().userPassword || "Passwords not matching";
                                }
                            })} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faKey} />
                        </span>
                    </div>
                    {errors.userPasswordConfirm && <p className="help is-danger">{errors.userPasswordConfirm.message}</p>}
                </div>
                <div className="field is-grouped">
                    <div className="control">
                        <button type="submit" className="button is-success">Registration</button>
                    </div>
                    <div className="control">
                        {unexpectedError.length !==0 && <p className="help is-danger">{unexpectedError}</p>}
                    </div>
                </div>

            </form>
        </div>
    )
}

export { RegistrationForm }

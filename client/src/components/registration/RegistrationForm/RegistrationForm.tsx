import { SubmitHandler, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'

import { SchemaValidation } from "./schemaValidation";
import { RequestWrapper } from "../../../api/JsonRequestWrapper";
import { CreateUserDTO } from "../../../api/dto/request/CreateUserDTO";
import { useState } from "react";
import { nameofPropChecker } from "../../../api/nameofPropChecker";
import { ErrorDTO } from "../../../api/dto/response/ErrorDTO";

import "./RegistrationForm.scss";

interface RegistrationFormProps {
    onRegistered?(userData: Inputs): void;
    endPoint: string;
}

export type Inputs = {
    userEmail: string,
    userName: string,
    userPassword: string,
    userPasswordConfirm: string
}

function RegistrationForm(props: RegistrationFormProps) {
    const { register, handleSubmit, setError, reset, formState: { errors }, watch } = useForm<Inputs>();
    const [unexpectedError, setUnexpectedError] = useState("");

    const onSubmit: SubmitHandler<Inputs> = (data, event) => {
        event?.preventDefault();

        const requestBody: CreateUserDTO = {
            email: data.userEmail,
            name: data.userName,
            password: data.userPassword
        }

        RequestWrapper.endPoint(props.endPoint).post(requestBody).send<null, ErrorDTO>()
            .then(res => {
                if (res.ok) {
                    if (props.onRegistered) {
                        props.onRegistered(data);
                    }
                    reset();
                    return Promise.resolve();
                }
                switch (res.code) {
                    case 400:
                        res.failure?.errors?.forEach(error => {
                            switch (error.param) {
                                case nameofPropChecker<CreateUserDTO>("email"):
                                    setError("userEmail", { message: error.msg }, { shouldFocus: true });
                                    break;
                                case nameofPropChecker<CreateUserDTO>("name"):
                                    setError("userName", { message: error.msg }, { shouldFocus: true });
                                    break;
                                case nameofPropChecker<CreateUserDTO>("password"):
                                    setError("userPassword", { message: error.msg }, { shouldFocus: true });
                                    break;
                                default:
                                    console.log(error);
                                    setUnexpectedError("Unexpected received response error format");
                                    break;
                            }
                        })
                        return Promise.resolve();
                    default:
                        console.log(res.failure);
                        setUnexpectedError(res.failure?.message || "Unexpected received response error format");
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
        <form className="registration-form" onSubmit={handleSubmit(onSubmit)}>

            <div className="form-input-block">
                <label >Email</label>
                <div className="control">
                    <span className="icon">
                        <FontAwesomeIcon icon={faEnvelope} />
                    </span>
                    <input className="input" type="email" placeholder="User email ..." {...register("userEmail", SchemaValidation.Email)} />
                </div>
                {errors.userEmail && <p className="error">{errors.userEmail.message}</p>}
            </div>

            <div className="form-input-block">
                <label className="label">Name</label>
                <div className="control">
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input className="input" type="text" placeholder="User name ..." {...register("userName", SchemaValidation.Name)} />
                </div>
                {errors.userName && <p className="error">{errors.userName.message}</p>}
            </div>

            <div className="form-input-block">
                <label className="label">Password</label>
                <div className="control">
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faKey} />
                    </span>
                    <input className="input" type="password" placeholder="User password ..." {...register("userPassword", SchemaValidation.Password)} />
                </div>
                {errors.userPassword && <p className="error">{errors.userPassword.message}</p>}
            </div>

            <div className="form-input-block">
                <label className="label">Confirm Password</label>
                <div className="control">
                    <span className="icon is-small is-left">
                        <FontAwesomeIcon icon={faKey} />
                    </span>
                    <input className="input" type="password" placeholder="User password ..."
                        {...register("userPasswordConfirm", {
                            validate: fieldValue => {
                                return fieldValue === watch().userPassword || "Passwords not matching";
                            }
                        })} />
                </div>
                {errors.userPasswordConfirm && <p className="error">{errors.userPasswordConfirm.message}</p>}
            </div>
            <div className="form-controls">
                <button type="submit" className="button button--primary">Registration</button>
                {unexpectedError.length !== 0 && <p className="error">{unexpectedError}</p>}
            </div>
        </form>
    )
}

export { RegistrationForm }

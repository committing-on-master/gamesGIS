import React from "react";
import { useForm, SubmitHandler, RegisterOptions } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'

type Inputs = {
    userEmail: string,
    userPassword: string,
};

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => alert(JSON.stringify(data));

    const emailValidationOpt: RegisterOptions = {
        required: "email field cannot be empty",
        maxLength: {
            value: 254,
            message: "email field cannot longer then 254 symbols"
        }
    }

    const passwordValidationOpt: RegisterOptions = {
        required: "password field cannot be empty",
        minLength: {
            value: 6,
            message: "password must be longer then 5 symbols"
        },
        maxLength: {
            value: 255,
            message: "password must be shorter then 255 symbols"
        }
    }

    return (
        <div className="p-3">
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="field">
                    <label className="label">Email</label>
                    <div className="control has-icons-left">
                        <input className="input" type="email" placeholder="User email ..." {...register("userEmail", emailValidationOpt)} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </span>
                    </div>
                    <p className="help is-danger">{errors.userEmail && errors.userEmail.message}</p>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control has-icons-left">
                        <input className="input" type="password" placeholder="User password ..." {...register("userPassword", passwordValidationOpt)} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faKey} />
                        </span>
                    </div>
                    <p className="help is-danger">{errors.userPassword && errors.userPassword.message}</p>
                </div>

                <div className="control">
                    <button type="submit" className="button is-link">Login</button>
                </div>

            </form>
            <p>Registration form: <a href="#">Link</a></p>
        </div>
    )
}

export { LoginForm };
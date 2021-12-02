import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey } from '@fortawesome/free-solid-svg-icons'
import { SchemaValidation } from "./../../schemas/schemaValidation";

type Inputs = {
    userPassword: string,
    userEmail: string
}

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data) => {
        alert(JSON.stringify(data));
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
            <p>Registration form: <a href="#">Link</a></p>
        </div>
    )
}

export { LoginForm };
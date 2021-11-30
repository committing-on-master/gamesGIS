import { SubmitHandler, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faUser } from '@fortawesome/free-solid-svg-icons'

import { SchemaValidation } from "../schemas/schemaValidation";

interface RegistrationFormProps {

}

type Inputs = {
    userEmail: string,
    userName: string,
    userPassword: string,
    userPasswordConfirm: string
}

function RegistrationForm(props: RegistrationFormProps) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = data => alert(JSON.stringify(data));
    
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
                            {...register("userPasswordConfirm", { validate: fieldValue => {
                                return fieldValue === watch().userPassword || "Passwords not matching";
                            }})} />
                        <span className="icon is-small is-left">
                            <FontAwesomeIcon icon={faKey} />
                        </span>
                    </div>
                    {errors.userPasswordConfirm && <p className="help is-danger">{errors.userPasswordConfirm.message}</p>}
                </div>

                <div className="control">
                    <button type="submit" className="button is-link">Registration</button>
                </div>

            </form>
        </div>
    )
}

export { RegistrationForm }

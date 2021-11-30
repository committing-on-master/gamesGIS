import { UseFormRegister, RegisterOptions } from "react-hook-form";
import { CustomFieldErrors } from "./../../types/FieldErrorDescription";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export type EmailInput = {
    userEmail: string
}

interface EmailFieldProps {
    register: UseFormRegister<EmailInput>;
    errors: CustomFieldErrors<EmailInput>;
}

function EmailField(props: EmailFieldProps) {
    const emailValidationOpt: RegisterOptions = {
        required: "email field cannot be empty",
        maxLength: {
            value: 254,
            message: "email field cannot longer then 254 symbols"
        }
    }

    let errorMessage = undefined;
    if (props.errors.userEmail || props.errors.userEmailBackend) {
        errorMessage = props.errors.userEmail ? props.errors.userEmail.message : props.errors.userEmailBackend;
    }

    return (<div className="field">
        <label className="label">Email</label>
        <div className="control has-icons-left">
            <input className="input" type="email" placeholder="User email ..." {...props.register("userEmail", emailValidationOpt)} />
            <span className="icon is-small is-left">
                <FontAwesomeIcon icon={faEnvelope} />
            </span>
        </div>
        <p className="help is-danger">{errorMessage && errorMessage}</p>
    </div>);
}
export { EmailField }
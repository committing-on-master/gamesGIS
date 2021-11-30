import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { UseFormRegister, RegisterOptions } from "react-hook-form";
import { CustomFieldErrors } from "./../../types/FieldErrorDescription";

export type PasswordInput = {
    userPassword: string
}

interface PasswordFieldProps {
    register: UseFormRegister<PasswordInput>;
    errors: CustomFieldErrors<PasswordInput>;
}

function PasswordField(props: PasswordFieldProps) {
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

    let errorMessage = undefined;
    if (props.errors.userPassword || props.errors.userPasswordBackend) {
        errorMessage = props.errors.userPassword ? props.errors.userPassword.message : props.errors.userPasswordBackend;
    }

    return (
        <div className="field">
            <label className="label">Password</label>
            <div className="control has-icons-left">
                <input className="input" type="password" placeholder="User password ..." {...props.register("userPassword", passwordValidationOpt)} />
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faKey} />
                </span>
            </div>
            <p className="help is-danger">{errorMessage && errorMessage}</p>
        </div>
    );
}
export { PasswordField }
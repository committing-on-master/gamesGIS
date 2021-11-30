import { UseFormRegister, RegisterOptions } from "react-hook-form";
import { CustomFieldErrors } from "./../../types/FieldErrorDescription";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

export type NameInput = {
    userName: string
}

interface NameFieldProps {
    register: UseFormRegister<NameInput>;
    errors: CustomFieldErrors<NameInput>;
}

function NameField(props: NameFieldProps) {
    const nameValidationOpt: RegisterOptions = {
        required: "name field cannot be empty",
        maxLength: {
            value: 24,
            message: "user name must be shorter then 24 symbols"
        },
        minLength: {
            value: 3,
            message: "user name must be longer then 3 symbols"
        }
    }

    let errorMessage = undefined;
    if (props.errors.userName || props.errors.userNameBackend) {
        errorMessage = props.errors.userName ? props.errors.userName.message : props.errors.userNameBackend;
    }

    return (
        <div className="field">
            <label className="label">Name</label>
            <div className="control has-icons-left">
                <input className="input" type="text" placeholder="User name ..." {...props.register("userName", nameValidationOpt)} />
                <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faUser} />
                </span>
            </div>
            <p className="help is-danger">{errorMessage && errorMessage}</p>
        </div>
    );
}

export { NameField }

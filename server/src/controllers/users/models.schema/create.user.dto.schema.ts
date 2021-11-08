import { SchemaValidationProps } from "../../common-types/schema.validation.type";
import { CreateUserDto } from "../../../services-layer/users/models/create.user.dto";

const createUserDtoSchema: SchemaValidationProps<CreateUserDto> = {
    email: {
        in: ["body"],
        exists: { errorMessage: "email body field is missing" },
        isEmpty: { negated: true, options:{ ignore_whitespace: true }, errorMessage: "email body field is empty" },
        trim: true,
        isEmail: { errorMessage: "wrong email format" }
    },
    password: {
        in: ["body"],
        exists: { errorMessage: "password body field is missing" },
        isEmpty: { negated:true, options:{ ignore_whitespace: true }, errorMessage: "password body field is empty" },
        isStrongPassword: {
            options: {
                minLength: 4
            },
            errorMessage: "Password should be at least 4 chars long"
        }
    },
    name: {
        in: ["body"],
        exists: { errorMessage: "name body field is missing" },
        isEmpty: { negated: true, options:{ ignore_whitespace: true }, errorMessage: "name body field is empty" },
        trim: true,
        isLength: {
            options: { min:3,  max: 25 },
            errorMessage: 'Username should not be greater than 25 symbols, not shorter than 3 symbols'
        },
    }
}

export { createUserDtoSchema }
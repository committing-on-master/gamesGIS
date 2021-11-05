import { SchemaValidationProps } from "../../common-types/schema.validation.type";
import { CreateUserDto } from "../../../services-layer/users/models/create.user.dto";

const createUserDtoSchema: SchemaValidationProps<CreateUserDto> = {
    email: {
        in: ["body"],
        exists: true,
        trim: true,
        isEmail: true
    },
    password: {
        in: ["body"],
        exists: true,
        isStrongPassword: {
            options: {
                minLength: 4
            },
            errorMessage: "Password should be at least 4 chars long"
        }
    },
    name: {
        in: ["body"],
        exists: true,
        trim: true,
        isLength: {
            options: { min:3,  max: 25 },
            errorMessage: 'Username should not be greater than 25 chars, not shorter than 3 chars'
        },
    }
}

export { createUserDtoSchema }
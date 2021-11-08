import { SchemaValidationProps } from "../../../controllers/common-types/schema.validation.type";
import { PatchUserDto } from "../../../services-layer/users/models/patch.user.dto";

const patchUserDtoSchema: SchemaValidationProps<PatchUserDto> = {
    email: {
        in: ["body"],
        optional: true,
        isEmpty: { negated: true, options:{ ignore_whitespace: true }, errorMessage: "email body field is empty" },
        trim: true,
        isEmail: { errorMessage: "wrong email format" }
    },
    password: {
        in: ["body"],
        optional: true,
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
        optional: true,
        isEmpty: { negated: true, options:{ ignore_whitespace: true }, errorMessage: "name body field is empty" },
        trim: true,
        isLength: {
            options: { min:3,  max: 25 },
            errorMessage: 'Username should not be greater than 25 symbols, not shorter than 3 symbols'
        },
    }
}

export { patchUserDtoSchema }
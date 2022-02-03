import { RegisterOptions } from "react-hook-form";
import { MapType } from "./../../../api/dto/types/MapType";

class SchemaValidation {
    static get ProfileName(): RegisterOptions {
        return {
            required: "name field cannot be empty",
            maxLength: {
                value: 24,
                message: "name must be shorter then 24 symbols"
            },
            minLength: {
                value: 3,
                message: "name must be longer then 3 symbols"
            }
        };
    }

    static get Map(): RegisterOptions {
        return {
            validate: (value) => {
                return value === MapType.Woods ? true : "Only woods map available on this stage of development";
            }
        };
    }
}
export { SchemaValidation }
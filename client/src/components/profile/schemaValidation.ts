import { RegisterOptions } from "react-hook-form";

class SchemaValidation  {
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
}
export { SchemaValidation }
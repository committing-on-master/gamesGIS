import { RegisterOptions } from "react-hook-form";

class SchemaValidation  {
    static get Email(): RegisterOptions {
        return {
            required: "email field cannot be empty",
            maxLength: {
                value: 254,
                message: "email field cannot longer then 254 symbols"
            }
        };
    }

    static get Password(): RegisterOptions {
        return {
            required: "password field cannot be empty",
            minLength: {
                value: 6,
                message: "password must be longer then 5 symbols"
            },
            maxLength: {
                value: 255,
                message: "password must be shorter then 255 symbols"
            }
        };
    }
}
export { SchemaValidation }
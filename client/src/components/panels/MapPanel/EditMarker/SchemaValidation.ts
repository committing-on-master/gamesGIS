import { RegisterOptions } from "react-hook-form";

class EditSchemaValidation  {
    static get MarkerName(): RegisterOptions {
        return{
            required: "name field cannot be empty",
            maxLength: {
                value: 30,
                message: "name must be shorter then 30 symbols"
            },
        }
    }

    static get MarkerDescription(): RegisterOptions {
        return{
            maxLength: {
                value: 256,
                message: "description must be shorter then 256 symbols"
            },
        }
    }

    static get MarkerColor(): RegisterOptions {
        return{
            required: true
        }
    }
}
export { EditSchemaValidation }
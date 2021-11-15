import { body, ValidationChain } from "express-validator";
import { UsersService } from "../../../services-layer/users/users.service";


function AsyncNameValidation(userService: UsersService): ValidationChain {
    const service: UsersService = userService;
    return body("name")
        .custom(async (value /*, { req, location, path } */) =>
            service.isNameAvailable(value)
                .then(available => (available) ? Promise.resolve() : Promise.reject("This name already in use"))
                .catch(error => {
                    console.log(error);
                })
        )
}

export { AsyncNameValidation }
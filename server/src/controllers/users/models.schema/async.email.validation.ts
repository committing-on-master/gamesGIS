import { body, ValidationChain } from "express-validator";
import { UsersService } from "../../../services-layer/users/users.service";


function AsyncEmailValidation(userService: UsersService): ValidationChain {
    const service: UsersService = userService;
    return body("email")
        .custom(async (value /*, { req, location, path } */) =>
            service.isEmailAvailable(value)
                .then(available => (available) ? Promise.resolve() : Promise.reject("This email already in use"))
        )
}

export { AsyncEmailValidation }
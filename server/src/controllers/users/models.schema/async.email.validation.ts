import { body, ValidationChain } from "express-validator";
import { UsersService } from "../../../services-layer/users/users.service";

/**
 * Проверка почты на предмет доступности (не занятости)
 * @param userService сервис по работе с пользователями
 * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
 */
function AsyncEmailValidation(userService: UsersService, optional: boolean = false): ValidationChain {
    const service: UsersService = userService;
    return body("email")
        .optional(optional)
        .custom(async (value /*, { req, location, path } */) =>
            service.isEmailAvailable(value)
                .then(available => (available) ? Promise.resolve() : Promise.reject("This email already in use"))
        )
}

export { AsyncEmailValidation }
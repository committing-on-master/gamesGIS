import { body, ValidationChain } from "express-validator";
import { UsersService } from "../../../services-layer/users/users.service";

/**
 * Проверка имени на предмет доступности
 * @param userService сервис по работе с пользователями
 * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
 */
function AsyncNameValidation(userService: UsersService, optional: boolean = false): ValidationChain {
    const service: UsersService = userService;
    return body("name")
        .optional(optional)
        .custom(async (value /*, { req, location, path } */) =>
            service.isNameAvailable(value)
                .then(available => (available) ? Promise.resolve() : Promise.reject("This name already in use"))
        )
}

export { AsyncNameValidation }
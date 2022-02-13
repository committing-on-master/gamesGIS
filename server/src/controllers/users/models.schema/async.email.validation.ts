import {body, ValidationChain} from "express-validator";
import {UsersService} from "../../../services-layer/users/users.service";

/**
 * Проверка почты на предмет доступности (не занятости)
 * @param {UsersService} userService сервис по работе с пользователями
 * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
 * @return {ValidationChain} схема валидации
 */
function asyncEmailValidation(userService: UsersService, optional: boolean = false): ValidationChain {
    const service: UsersService = userService;
    return body("email")
        .optional(optional)
        .custom(async (value /* , { req, location, path } */) =>
            service.isEmailAlreadyExist(value)
                .then((exist) => (exist) ? Promise.reject(new Error("This email already in use")) : Promise.resolve()),
        );
}

export {asyncEmailValidation};

import {body, ValidationChain} from "express-validator";
import {UsersService} from "../../../services-layer/users/users.service";

/**
 * Проверка имени на предмет доступности (не занятости)
 * @param {UsersService} userService сервис по работе с пользователями
 * @param {boolean} [optional = false] опциональность поля, true для случаев когда наличие поля пустым допускается
 * @return {ValidationChain} схема для валидатора
 */
function asyncNameValidation(userService: UsersService, optional: boolean = false): ValidationChain {
    const service: UsersService = userService;
    return body("name")
        .optional(optional)
        .custom(async (value /* , { req, location, path } */) =>
            service.isNameAlreadyExist(value)
                .then((exist) => (exist) ? Promise.reject(new Error("This name already in use")) : Promise.resolve()),
        );
}

export {asyncNameValidation};

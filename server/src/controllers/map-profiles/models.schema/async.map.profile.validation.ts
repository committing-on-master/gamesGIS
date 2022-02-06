import {body, ValidationChain} from "express-validator";
import {nameofPropChecker} from "./../../../infrastructure/name.of.prop.checker";
import {MapProfileService} from "./../../../services-layer/map-profile/map.profile.service";
import {MapProfileDto} from "../../../dto/request/map.profile.dto";

/**
 * Проверка имени на предмет доступности (не занятости)
 * @param {MapProfileService} userService сервис по работе с профилями карт
 * @return {ValidationChain} схема для валидатора
 */
function asyncMapProfileValidation(userService: MapProfileService): ValidationChain {
    const service: MapProfileService = userService;
    return body(nameofPropChecker<MapProfileDto>("profileName"))
        .custom(async (value /* , { req, location, path } */) =>
            service.isNameExist(value)
                .then((exist) => {
                    return (exist) ? Promise.reject(new Error("This name already in use")) : Promise.resolve();
                }),
        );
}

export {asyncMapProfileValidation};

import express from "express";
import {inject, singleton} from "tsyringe";
import winston from "winston";

import {TokenInjection} from "./../infrastructure/token.injection";
import {PermissionFlag} from "./../services-layer/users/models/permission.flag";
import {CommonMiddleware} from "./common.middleware";

@singleton()
class PermissionMiddleware extends CommonMiddleware {
    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger) {
        super(logger, "PermissionMiddleware");
    }

    /**
     * Проверка прав доступа пользователя
     * @param {PermissionFlag} requiredPermissionFlag требуемый уровень прав, для дальнейшего прохождения запроса
     * @return {Function} middleware функция, проверяющая входящий запрос на наличие соответствующих прав
     */
    public permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
        const requiredFlag = requiredPermissionFlag;
        return function(
            req: express.Request,
            res: express.Response,
            next: express.NextFunction,
        ) {
            const userPermissionFlag = res.locals.jwt.permissionFlag;
            if (userPermissionFlag & requiredFlag) {
                return next();
            } else {
                res.status(403).send();
            }
        };
    }

    public async onlySameUserOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const userPermissionFlag = res.locals.jwt.permissionFlag;
        if (res.locals.userId === res.locals.jwt.userId) {
            return next();
        } else {
            if (userPermissionFlag & PermissionFlag.ADMIN_PERMISSION) {
                return next();
            } else {
                return res.status(403).send();
            }
        }
    }

    /**
     * Достает PermissionFlag из запроса, проверяет его корректность
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @return {void}
     * */
    extractPermissionFlag(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        if (Number.isNaN(req.body?.permissionFlag)) {
            return res.status(400).send({
                error: "Permission null or have incorrect format",
            });
        }
        const permission = parseInt(req.body.permissionFlag, 10);
        if ( !(permission in PermissionFlag) ) {
            return res.status(400).send({
                error: "Incorrect value for permission level",
            });
        }

        res.locals.permissionFlag = permission;
        next();
    }
}

export {PermissionMiddleware};

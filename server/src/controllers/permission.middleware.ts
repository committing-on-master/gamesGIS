import express from "express";
import { inject, singleton } from "tsyringe";
import winston from "winston";

import { TokenInjection } from "./../infrastructure/token.injection";
import { PermissionFlag } from "./../services-layer/users/models/permission.flag";
import { CommonMiddleware } from "./common.middleware";

@singleton()
class PermissionMiddleware extends CommonMiddleware {

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger) {
        super(logger, "PermissionMiddleware");
    }

    /**
     * Проверка прав доступа пользователя
     * @param requiredPermissionFlag требуемый уровень прав, для дальнейшего прохождения запроса
     */
    public permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
        const requiredFlag = requiredPermissionFlag;
        return function (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) {
            const userPermissionFlags = res.locals.jwt.permissionFlags;
            if (userPermissionFlags & requiredFlag) {
                next();
            } else {
                res.status(403).send();
            }
        };
    }


    public async onlySameUserOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
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

    public async userCantChangePermission(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (
            'permissionFlags' in req.body &&
            req.body.permissionFlags !== res.locals.user.permissionFlags
        ) {
            res.status(400).send({
                errors: ['User cannot change permission flags'],
            });
        } else {
            next();
        }
    }
}

export { PermissionMiddleware }
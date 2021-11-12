import express from "express";
import { TokenInjection } from "./../infrastructure/token.injection";
import { PermissionFlag } from "./../services-layer/users/models/permission.flag";
import { inject, singleton } from "tsyringe";
import winston from "winston";
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
        return (
            req: express.Request,
            res: express.Response,
            next: express.NextFunction
        ) => {
            try {
                const userPermissionFlags = parseInt(
                    res.locals.jwt.permissionFlags
                );
                if (userPermissionFlags & requiredPermissionFlag) {
                    next();
                } else {
                    res.status(403).send();
                }
            } catch (error) {
                this.logger.error(`${this.name}.permissionFlagRequired`, error);
            }
        };
    }

    
    public async onlySameUserOrAdminCanDoThisAction(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userPermissionFlags = parseInt(res.locals.jwt.permissionFlags);
        if (
            req.params &&
            req.params.userId &&
            req.params.userId === res.locals.jwt.userId
        ) {
            return next();
        } else {
            if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
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
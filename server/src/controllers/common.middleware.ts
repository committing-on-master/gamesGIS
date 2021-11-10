import express from "express";
import winston from "winston";
import { validationResult } from "express-validator";
import { PermissionFlag } from "../services-layer/users/models/permission.flag";

abstract class CommonMiddleware {
    protected readonly logger: winston.Logger;
    protected readonly name: string;

    constructor(logger: winston.Logger, name: string) {
        this.logger = logger;
        this.name = name;
        this.logger.info(`Creating middleware for: ${name}`);
        
        // Миддляваря уходит в роуты экспреса, поэтому биндим метод, чтобы не потерять логгер
        this.schemaValidationResult = this.schemaValidationResult.bind(this);
        this.permissionFlagRequired = this.permissionFlagRequired.bind(this);
    }

    /**
     * Проверяет request на предмет результатов работы express validator-a.
     * При наличие ошибок, возвращает response с кодом ошибки
     */
    public schemaValidationResult(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        } catch (error){
            this.logger.error(`${this.name}.schemaValidationResult`, error);
            return res.status(500).send();
        }        
    }

    /**
     * Проверка прав доступа пользователя
     * @param requiredPermissionFlag требуемый уровень прав, для дальнейшего прохождения запроса
     */
    permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
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

    
    async onlySameUserOrAdminCanDoThisAction(
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

    async userCantChangePermission(
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

export { CommonMiddleware }
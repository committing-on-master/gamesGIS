import express from 'express';
import { inject, injectable } from 'tsyringe';
import winston from 'winston';

import { ServicesLayer } from '../../services-layer/services.layer';
import { CommonMiddleware } from '../common.middleware';
import { TokenInjection } from '../../infrastructure/token.injection';

@injectable()
class UsersMiddleware extends CommonMiddleware {
    readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "UsersMiddleware");

        this.services = services;

        // методы уходят в мидлварю экспресса, биндим this
        this.validateUserExists = this.validateUserExists.bind(this);
        this.extractUserId = this.extractUserId.bind(this);
    }

    /**
     * Ранний возврат для Patch endpoint-а. Так как все поля модели могут быть пустыми
     */
    public earlyReturnPatchUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body?.email 
            || req.body?.password 
            || req.body?.name
            ) {
                return next();
        } else {
            res.status(200).send({msg: "All update field are empty"});
        }
    }

    /**Проверка, что в route указан существующий пользователь */
    public async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const userExist = await this.services.usersService.isUserExist(res.locals.userId);
        if (userExist) {
            return next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    public async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (Number.isNaN(req.params.userId)) {
            return res.status(404).send({
                error: `User ${req.params.userId} not a number`,
            });
        }
        res.locals.userId = parseInt(req.params.userId, 10);
        next();
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

export { UsersMiddleware };
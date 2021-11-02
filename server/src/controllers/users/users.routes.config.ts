import { CommonRoutesConfig } from '../common.routes.config';
import { UsersController } from './users.controller';
import { UsersMiddleware } from './users.middleware';
import express from 'express';
import { inject, injectable } from 'tsyringe';
import winston from 'winston';
import { TokenInjection } from "../../infrastructure/token.injection";

@injectable()
export class UsersRoutes extends CommonRoutesConfig {
    readonly usersMiddleware: UsersMiddleware;
    readonly usersController: UsersController;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, usersMiddleware: UsersMiddleware, usersController: UsersController) {
        super(logger, "UsersRoutes");

        this.usersController = usersController;
        this.usersMiddleware = usersMiddleware;
    }

    configureRoutes(app: express.Application): express.Application {
        this.logger.info(`Express route registration: "${this.getName()}"`);
        app
            .route(`/users`)
            .get(this.usersController.listUsers)
            .post(
                this.usersMiddleware.validateRequiredUserBodyFields,
                this.usersMiddleware.validateSameEmailDoesntExist,
                this.usersController.createUser
            );

        app
            .param(`userId`, this.usersMiddleware.extractUserId);
        app
            .route(`/users/:userId`)
            .all(this.usersMiddleware.validateUserExists)
            .get(this.usersController.getUserById)
            .delete(this.usersController.removeUser);

        app.put(`/users/:userId`, [
            this.usersMiddleware.validateRequiredUserBodyFields,
            this.usersMiddleware.validateSameEmailBelongToSameUser,
            this.usersController.put,
        ]);

        app.patch(`/users/:userId`, [
            this.usersMiddleware.validatePatchEmail,
            this.usersController.patch,
        ]);

        return app;
    }
}
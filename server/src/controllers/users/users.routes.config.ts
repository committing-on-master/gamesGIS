import { CommonRoutesConfig } from '../common.routes.config';
import { UsersController } from './users.controller';
import { UsersMiddleware } from './users.middleware';
import express from 'express';
import { inject, injectable, singleton } from 'tsyringe';

@injectable()
export class UsersRoutes extends CommonRoutesConfig {
    readonly usersMiddleware: UsersMiddleware;
    readonly usersController: UsersController;

    constructor(@inject("ExpressJsApp") app: express.Application, usersMiddleware: UsersMiddleware, usersController: UsersController) {
        super(app, 'UsersRoutes');
        this.usersController = usersController;
        this.usersMiddleware = usersMiddleware;

        this.configureRoutes();
    }

    configureRoutes(): express.Application {
        this.app
            .route(`/users`)
            .get(this.usersController.listUsers)
            .post(
                this.usersMiddleware.validateRequiredUserBodyFields,
                this.usersMiddleware.validateSameEmailDoesntExist,
                this.usersController.createUser
            );

        this.app.param(`userId`, this.usersMiddleware.extractUserId);
        this.app
            .route(`/users/:userId`)
            .all(this.usersMiddleware.validateUserExists)
            .get(this.usersController.getUserById)
            .delete(this.usersController.removeUser);

        this.app.put(`/users/:userId`, [
            this.usersMiddleware.validateRequiredUserBodyFields,
            this.usersMiddleware.validateSameEmailBelongToSameUser,
            this.usersController.put,
        ]);

        this.app.patch(`/users/:userId`, [
            this.usersMiddleware.validatePatchEmail,
            this.usersController.patch,
        ]);

        return this.app;
    }
}
import { CommonRoutesConfig } from '../common.routes.config';
import { UsersController } from './users.controller';
import { UsersMiddleware } from './users.middleware';
import express from 'express';
import { inject, injectable } from 'tsyringe';
import winston from 'winston';
import { TokenInjection } from "../../infrastructure/token.injection";
import { PermissionMiddleware } from '../permission.middleware';

@injectable()
export class UsersRoutes extends CommonRoutesConfig {
    readonly usersMiddleware: UsersMiddleware;
    readonly usersController: UsersController;
    readonly permissionMiddleware: PermissionMiddleware;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
                usersMiddleware: UsersMiddleware,
                permissionMiddleware: PermissionMiddleware,
                usersController: UsersController) {
        super(logger, "UsersRoutes");

        this.usersController = usersController;
        this.usersMiddleware = usersMiddleware;
        this.permissionMiddleware = permissionMiddleware;
    }

    protected configureRoute(app: express.Application): express.Application {
        app
            .route(`/users`)
            .get(this.usersController.listUsers)
            .post(
                this.usersMiddleware.validateCreateUserSchema(),
                this.usersMiddleware.schemaValidationResult,
                this.usersController.createUser
            );

        app
            .param(`userId`, this.usersMiddleware.extractUserId);
        app
            .route(`/users/:userId`)
            .all(
                this.usersMiddleware.validateUserExists,
                this.permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(this.usersController.getUserById)
            .delete(this.usersController.removeUser);

        app.patch(`/users/:userId`,
            this.usersMiddleware.earlyReturnPatchUser,
            this.usersMiddleware.validatePatchUserSchema(),
            this.usersMiddleware.schemaValidationResult,
            this.usersController.patchUser,
        );

        return app;
    }
}
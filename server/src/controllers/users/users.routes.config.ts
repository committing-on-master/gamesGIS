import express from 'express';
import { inject, injectable } from 'tsyringe';
import winston from 'winston';
import { checkSchema } from 'express-validator';

import { CommonRoutesConfig } from '../common.routes.config';
import { UsersController } from './users.controller';
import { UsersMiddleware } from './users.middleware';
import { TokenInjection } from "../../infrastructure/token.injection";
import { PermissionMiddleware } from '../permission.middleware';
import { createUserDtoSchema } from './models.schema/create.user.dto.schema';
import { patchUserDtoSchema } from './models.schema/update.user.dto.schema';
import { AsyncEmailValidation } from './models.schema/async.email.validation';
import { UsersService } from './../../services-layer/users/users.service';
import { AsyncNameValidation } from './models.schema/async.name.validation';
import { AuthMiddleware } from '../auth/auth.middleware';

@injectable()
export class UsersRoutes extends CommonRoutesConfig {
    private readonly usersMiddleware: UsersMiddleware;
    private readonly usersController: UsersController;
    private readonly permissionMiddleware: PermissionMiddleware;
    private readonly authMiddleware: AuthMiddleware;
    private readonly usersService: UsersService;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
                usersMiddleware: UsersMiddleware,
                permissionMiddleware: PermissionMiddleware,
                authMiddleware: AuthMiddleware,
                usersController: UsersController,
                usersService: UsersService) {
        super(logger, "UsersRoutes");

        this.usersController = usersController;
        this.usersMiddleware = usersMiddleware;
        this.permissionMiddleware = permissionMiddleware;
        this.authMiddleware = authMiddleware;
        this.usersService = usersService;
    }

    protected configureRoute(app: express.Application): express.Application {
        app
            .route(`/users`)
            .get(this.usersController.listUsers)
            .post(
                this.usersMiddleware.validateRequestSchema(checkSchema(createUserDtoSchema)),
                this.usersMiddleware.validateRequestSchema(AsyncEmailValidation(this.usersService)),
                this.usersMiddleware.validateRequestSchema(AsyncNameValidation(this.usersService)),
                this.usersController.createUser
            );

        app
            .param(`userId`, this.usersMiddleware.extractUserId);
        app
            .route(`/users/:userId`)
            .all(
                this.authMiddleware.jwtTokenValidation(),
                this.usersMiddleware.validateUserExists,
                this.permissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(this.usersController.getUserById)
            // .delete(this.usersController.removeUser);

        app.patch(`/users/:userId`,
            this.usersMiddleware.earlyReturnPatchUser,
            this.usersMiddleware.validateRequestSchema(checkSchema(patchUserDtoSchema)),
            // this.usersMiddleware.validatePatchUserSchema(),
            // this.usersMiddleware.schemaValidationResult,
            this.usersController.patchUser,
        );

        return app;
    }
}
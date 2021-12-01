import express from "express";
import {inject, injectable} from "tsyringe";
import winston from "winston";
import {checkSchema} from "express-validator";

import {CommonRoutesConfig} from "../common.routes.config";
import {UsersController} from "./users.controller";
import {UsersMiddleware} from "./users.middleware";
import {TokenInjection} from "../../infrastructure/token.injection";
import {PermissionMiddleware} from "../permission.middleware";
import {createUserDtoSchema} from "./models.schema/create.user.dto.schema";
import {patchUserDtoSchema} from "./models.schema/update.user.dto.schema";
import {asyncEmailValidation} from "./models.schema/async.email.validation";
import {UsersService} from "./../../services-layer/users/users.service";
import {asyncNameValidation} from "./models.schema/async.name.validation";
import {AuthMiddleware} from "../auth/auth.middleware";
import {PermissionFlag} from "./../../services-layer/users/models/permission.flag";

@injectable()
class UsersRoutes extends CommonRoutesConfig {
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
            .route("/users")
            .get(this.usersController.listUsers)
            .post(
                this.usersMiddleware.validateRequestSchema(checkSchema(createUserDtoSchema)),
                this.usersMiddleware.validateRequestSchema(asyncEmailValidation(this.usersService)),
                this.usersMiddleware.validateRequestSchema(asyncNameValidation(this.usersService)),
                this.usersController.createUser,
            );

        app
            .param("userId", this.usersMiddleware.extractUserId);
        app
            .route("/users/:userId")
            .all(
                this.authMiddleware.jwtTokenValidation(),
                this.usersMiddleware.validateUserExists,
                this.permissionMiddleware.onlySameUserOrAdminCanDoThisAction,
            )
            .get(this.usersController.getUser)
            .patch(
                this.usersMiddleware.earlyReturnPatchUser,
                this.usersMiddleware.validateRequestSchema(checkSchema(patchUserDtoSchema)),
                this.usersMiddleware.validateRequestSchema(asyncEmailValidation(this.usersService, true)),
                this.usersMiddleware.validateRequestSchema(asyncNameValidation(this.usersService, true)),
                this.usersController.patchUser, // обычный апдейт, без верификаций паролем и прочих критически важных штук
            );

        app.patch("/users/:userId/permission",
            this.authMiddleware.jwtTokenValidation(),
            this.usersMiddleware.validateUserExists,
            this.permissionMiddleware.extractPermissionFlag,
            this.permissionMiddleware.permissionFlagRequired(PermissionFlag.ADMIN_PERMISSION),
            this.usersController.changeUserPermission,
        );

        return app;
    }
}

export {UsersRoutes};

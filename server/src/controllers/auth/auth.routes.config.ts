import express from "express";
import {TokenInjection} from "../../infrastructure/token.injection";
import {inject, injectable} from "tsyringe";
import winston from "winston";
import {CommonRoutesConfig} from "../common.routes.config";
import {AuthController} from "./auth.controller";
import {AuthMiddleware} from "./auth.middleware";
import {checkSchema} from "express-validator";
import {LoginAuthSchema} from "./models.schema/login.auth.schema";
import {RefreshAuthSchema} from "./models.schema/refresh.auth.schema";
import {asyncWrapper} from "../asyncHandler";

@injectable()
class AuthRoutes extends CommonRoutesConfig {
    private readonly controller: AuthController;
    private readonly middleware: AuthMiddleware;

    constructor(@inject(TokenInjection.LOGGER)logger: winston.Logger, controller: AuthController, middleware: AuthMiddleware) {
        super(logger, "AuthRoutes");
        this.controller = controller;
        this.middleware = middleware;
    }

    protected configureRoute(route: express.Router): express.Router {
        route.post("/auth", // authentication request - "мой логин-пароль, дай мне пару токенов access-refresh"
            asyncWrapper(this.middleware.validateRequestSchema(checkSchema(LoginAuthSchema))),
            asyncWrapper(this.middleware.verifyUserPassword),
            asyncWrapper(this.controller.createJWT),
        );
        route.post("/auth/refresh-token", // authentication request - "мой id и refresh, дай новую пару access-refresh
            asyncWrapper(this.middleware.validateRequestSchema(checkSchema(RefreshAuthSchema))),
            asyncWrapper(this.middleware.verifyRefreshToken),
            asyncWrapper(this.controller.createJWT),
        );

        route.post("/auth/logout", // отозвать refresh token
            this.middleware.jwtTokenValidation(),
            this.controller.revokeRefreshToken,
        );

        route.use(this.middleware.handleOperationalErrors);
        return route;
    }
}

export {AuthRoutes};

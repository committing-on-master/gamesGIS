import {Application} from "express";
import {TokenInjection} from "../../infrastructure/token.injection";
import {inject, injectable} from "tsyringe";
import winston from "winston";
import {CommonRoutesConfig} from "../common.routes.config";
import {AuthController} from "./auth.controller";
import {AuthMiddleware} from "./auth.middleware";
import {checkSchema} from "express-validator";
import {LoginAuthSchema} from "./models.schema/login.auth.schema";

@injectable()
class AuthRoutes extends CommonRoutesConfig {
    private readonly controller: AuthController;
    private readonly middleware: AuthMiddleware;

    constructor(@inject(TokenInjection.LOGGER)logger: winston.Logger, controller: AuthController, middleware: AuthMiddleware) {
        super(logger, "AuthRoutes");
        this.controller = controller;
        this.middleware = middleware;
    }

    protected configureRoute(app: Application): Application {
        app.post("/auth", // authentication request - "мой логин-пароль, дай мне пару токенов access-refresh"
            this.middleware.validateRequestSchema(checkSchema(LoginAuthSchema)),
            this.middleware.verifyUserPassword,
            this.controller.createJWT,
        );
        app.post("/auth/refresh-token", // authentication request - "мой access-refresh, дай новую пару access-refresh
            this.middleware.jwtTokenValidation({ignoreExpiration: true}), // вот это вот дебатабельно, но пускай будет пока так
            this.middleware.verifyRefreshTokenBodyField,
            this.middleware.verifyRefreshToken,
            this.controller.createJWT,
        );

        app.post("/auth/logout", // отозвать refresh token
            this.middleware.jwtTokenValidation(),
            this.controller.revokeRefreshToken,
        );
        return app;
    }
}

export {AuthRoutes};

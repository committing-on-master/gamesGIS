import { Application } from "express";
import { TokenInjection } from "../../infrastructure/token.injection";
import { inject, injectable } from "tsyringe";
import winston from "winston";
import { CommonRoutesConfig } from "../common.routes.config";
import { AuthController } from "./auth.controller";
import { AuthMiddleware } from "./auth.middleware";

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
        app.post("/auth", // authentication request - "Это я, дай токен для проведения операции."
            this.middleware.authSchemaValidation(),
            this.middleware.schemaValidationResult,
            this.middleware.verifyUserPassword,
            this.controller.createJWT
        );
        app.post("/auth/refresh-token", // authentication request - "Это я, токен протух, дай новый"
            this.middleware.validJWTNeeded,
            this.middleware.verifyRefreshBodyField,
            this.middleware.validRefreshNeeded,
            this.controller.createJWT
        )
        return app;
    }
}

export { AuthRoutes }
import {Application} from "express";
import {inject, injectable} from "tsyringe";
import winston from "winston";

import {CommonRoutesConfig} from "../common.routes.config";
import {AgreementsController} from "./agreements.controller";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {AgreementsMiddleware} from "./agreements.middleware";
import {asyncWrapper} from "../asyncHandler";

@injectable()
class AgreementsRoutes extends CommonRoutesConfig {
    private readonly controller: AgreementsController;
    private readonly middleware: AgreementsMiddleware;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
        controller: AgreementsController,
        middleware: AgreementsMiddleware) {
        super(logger, "AgreementsRoutes");
        this.controller = controller;
        this.middleware = middleware;
    }

    protected configureRoute(route: Application): Application {
        route.get("/agreement",
            asyncWrapper(this.controller.getUserAgreement),
        );
        route.use(this.middleware.handleOperationalErrors);

        return route;
    }
}

export {AgreementsRoutes};

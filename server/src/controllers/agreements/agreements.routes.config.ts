import {Application} from "express";
import {inject, injectable} from "tsyringe";
import winston from "winston";

import {CommonRoutesConfig} from "../common.routes.config";
import {AgreementsController} from "./agreements.controller";
import {TokenInjection} from "./../../infrastructure/token.injection";

@injectable()
class AgreementsRoutes extends CommonRoutesConfig {
    private readonly controller: AgreementsController;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, controller: AgreementsController) {
        super(logger, "AgreementsRoutes");
        this.controller = controller;
    }

    protected configureRoute(app: Application): Application {
        app.get("/agreement",
            this.controller.getUserAgreement,
        );
        return app;
    }
}

export {AgreementsRoutes};

import {inject, injectable} from "tsyringe";
import winston from "winston";
import express from "express";
import httpErrors from "http-errors";

import {ServicesLayer} from "./../../services-layer/services.layer";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {CommonController} from "./../common.controller";
import {AgreementDto} from "../../dto/response/agreement.dto";

@injectable()
class AgreementsController extends CommonController {
    private readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "AgreementsController");
        this.services = services;

        this.getUserAgreement = this.getUserAgreement.bind(this);
    }

    public async getUserAgreement(req: express.Request, res: express.Response) {
        const agreement = await this.services.Agreements.getLastAgreement();
        if (!agreement) {
            throw new httpErrors.NotFound("user license not found");
        }
        const agreementDto: AgreementDto = {
            version: agreement.version,
            agreementText: agreement.agreementBody,
        };
        return res.status(200).json({message: "loaded", payload: agreementDto});
    }
}

export {AgreementsController};

import { inject, injectable } from "tsyringe";
import winston from "winston";
import express from "express";

import { ServicesLayer } from "./../../services-layer/services.layer";
import { TokenInjection } from "./../../infrastructure/token.injection";
import { CommonController } from "./../common.controller";
import { GetAgreementDto } from "./../../services-layer/agreements/models/get.agreement.dto";

@injectable()
class AgreementsController extends CommonController {
    private readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "AgreementsController");
        this.services = services;

        this.getUserAgreement = this.getUserAgreement.bind(this);
    }

    public async getUserAgreement(req: express.Request, res: express.Response) {
        try {
            const agreement = await this.services.Agreements.getLastAgreement();
            if (!agreement) {
                return res.status(404).send({});
            }
            const result: GetAgreementDto = {
                version: agreement.version,
                agreementText: agreement.agreementBody
            }
            return res.status(200).send({agreement: result});
        } catch (error) {
            this.logger.error(`${this.name}.getUserAgreement`, error);
            return res.status(500).send({});
        }
    }    
}

export { AgreementsController }
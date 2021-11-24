import { inject, injectable } from "tsyringe";
import winston from "winston";

import { TokenInjection } from "./../../infrastructure/token.injection";
import { DataLayer } from "./../../data-layer/data.layer";

@injectable()
class AgreementsService {
    private readonly logger: winston.Logger;
    private readonly dataLayer: DataLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
                dataLayer: DataLayer) {
        this.logger = logger;
        this.logger.info("AgreementService creation");

        this.dataLayer = dataLayer;
    }

    public async getLastAgreement() {
        return await this.dataLayer.agreementsRepository.getLastAgreement();
    }
    
}

export { AgreementsService }
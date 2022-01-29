import {TokenInjection} from "./../../infrastructure/token.injection";
import {inject, injectable} from "tsyringe";
import winston from "winston";
import {CommonMiddleware} from "../common.middleware";

@injectable()
class AgreementsMiddleware extends CommonMiddleware {
    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger) {
        super(logger, "AgreementsMiddleware");
    }
}

export {AgreementsMiddleware};

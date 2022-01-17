import {inject, injectable} from "tsyringe";
import winston from "winston";

import {CommonMiddleware} from "../common.middleware";
import {TokenInjection} from "../../infrastructure/token.injection";

@injectable()
class MapProfileMiddleware extends CommonMiddleware {
    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger) {
        super(logger, "MapProfileMiddleware");

        // this.extractProfileName = this.extractProfileName.bind(this);
    }
}

export {MapProfileMiddleware};

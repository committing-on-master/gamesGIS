import winston from "winston";

abstract class CommonController {
    protected readonly logger: winston.Logger;
    /**
     *
     */
    constructor(logger: winston.Logger, name:string) {
        this.logger = logger;
        this.logger.info(`Creating controller for ${name}`);        
    }
}

export { CommonController }
import express from "express";
import winston from "winston";

abstract class CommonRoutesConfig {
    private readonly name: string;
    protected readonly logger: winston.Logger;

    constructor(logger: winston.Logger, name: string) {
        this.logger = logger;
        this.logger.info(`Creating route config for: ${name}`);

        this.name = name;
    }
    
    public registerRoutes(app: express.Application): express.Application {
        this.logger.info(`Express route registration: "${this.name}"`);
        return this.configureRoute(app);
    }
    
    protected abstract configureRoute(app: express.Application): express.Application;
}

export { CommonRoutesConfig }
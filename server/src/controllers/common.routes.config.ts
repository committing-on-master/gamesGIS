import express from "express";
import winston from "winston";

export abstract class CommonRoutesConfig {
    name: string;
    readonly logger: winston.Logger;

    constructor(logger: winston.Logger, name: string) {
        this.logger = logger;
        this.logger.info(`Creating route config for: ${name}`);

        this.name = name;
    }
    getName() {
        return this.name;
    }

    public abstract configureRoutes(app: express.Application): express.Application;
}
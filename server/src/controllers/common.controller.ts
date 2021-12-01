import express from "express";
import winston from "winston";

abstract class CommonController {
    protected readonly logger: winston.Logger;
    protected readonly name: string;
    constructor(logger: winston.Logger, name:string) {
        this.logger = logger;
        this.logger.info(`Creating controller for ${name}`);        
        this.name = name;
    }
}

export { CommonController }
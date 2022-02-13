import winston from "winston";

import {GisApplication} from "./gis.application";
import {EnvironmentWrapper} from "./infrastructure/environment.wrapper";

const loggerOptions: winston.LoggerOptions = {
    level: "info",
    format: winston.format.combine(winston.format.colorize({all: true}), winston.format.json()),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({format: winston.format.simple()}),

        // - Write all logs with level `error` and below to `error.log`
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),

        // - Write all logs with level `info` and below to `combined.log`
        // new winston.transports.File({ filename: 'combined.log' }),
    ],
};

const logger: winston.Logger = winston.createLogger(loggerOptions);

const settings = new EnvironmentWrapper();

const gisApp = new GisApplication(logger, settings);
gisApp
    .setUp()
    .then(() => {
        gisApp.start();
    });

process.on("SIGINT", () => {
    gisApp.stop();
    process.exit(0);
});

process.on("uncaughtException", (error: Error) => {
    logger.error("Server is shuting down, uncaught Exception at top level", error);
    gisApp.stop();
    process.exit(0);
});

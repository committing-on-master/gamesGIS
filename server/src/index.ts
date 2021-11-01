import dotenv from "dotenv";
import winston from "winston";
import * as expressWinston from "express-winston";

import { GisApplication } from "./gis.application";

const loggerOptions: winston.LoggerOptions = {
    level: 'info',
    format: winston.format.combine(winston.format.colorize({all: true}), winston.format.json()),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.Console({format: winston.format.simple()})

        // - Write all logs with level `error` and below to `error.log`
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),

        // - Write all logs with level `info` and below to `combined.log`
        // new winston.transports.File({ filename: 'combined.log' }),
    ],
}

const logger: winston.Logger = winston.createLogger(loggerOptions);

// Загрузили конфигу в глобальную переменную process
dotenv.config( {path: "./config/.env"} );

const port = Number.parseInt(process.env.PORT ?? "3000");

const gisApp = new GisApplication(logger, port);

gisApp.start();

process.on("SIGINT", () => {
    gisApp.stop();
    process.exit(0);
});
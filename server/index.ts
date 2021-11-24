import dotenv from "dotenv";
import winston from "winston";

import { GisApplication } from "./src/gis.application";

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
const dotenvResult = dotenv.config( {path: "./config/.env"} );
if (dotenvResult.error) {
    throw dotenvResult.error;
}

const port = Number.parseInt(process.env.PORT ?? "3000");
const jwtSecret = process.env.JWT_SECRET || "My!@!Se3cr8tH4sh3";
const jwtExpiration = (process.env.JWT_EXPIRATION && parseInt(process.env.JWT_EXPIRATION)) || 300;
const refreshTokenExpiration = (process.env.REFRESH_TOKEN_EXPIRATION && parseInt(process.env.REFRESH_TOKEN_EXPIRATION)) || 10;

const gisApp = new GisApplication(logger, port);
gisApp
    // .setUp("in-memory", jwtSecret, jwtExpiration, refreshTokenExpiration)
    .setUp("production", jwtSecret, jwtExpiration, refreshTokenExpiration)
    .then(() => {
        gisApp.start();
    })

process.on("SIGINT", () => {
    gisApp.stop();
    process.exit(0);
});
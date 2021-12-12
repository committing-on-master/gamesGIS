import "reflect-metadata";
import {container} from "tsyringe";

import path from "path";
import * as http from "http";

import express from "express";
import cors from "cors";
import * as expressWinston from "express-winston";
import winston from "winston";
import {WinstonAdaptor} from "typeorm-logger-adaptor/logger/winston";


import {CommonRoutesConfig} from "./controllers/common.routes.config";
import {UsersRoutes} from "./controllers/users/users.routes.config";
import {TokenInjection} from "./infrastructure/token.injection";
import {Connection, createConnection, getConnectionOptions} from "typeorm";
import {AuthRoutes} from "./controllers/auth/auth.routes.config";
import {AgreementsRoutes} from "./controllers/agreements/agreements.routes.config";

class GisApplication {
    readonly port: number;
    readonly host: string;
    readonly logger: winston.Logger;
    readonly routes: Array<CommonRoutesConfig>;

    private app?: express.Application;
    server?: http.Server;
    private startingDate?: Date;
    private dbConnection?: Connection;

    constructor(logger: winston.Logger, port: number, host?: string) {
        this.logger = logger;
        logger.info("Starting GameGis application");

        this.port = port;
        this.host = host ?? "localhost";
        this.routes = [];
    }

    /* eslint-disable new-cap */
    public async setUp(connectionName: string, jwtSecret: string, jwtExpiration:number, refreshTokenExpiration: number) {
        container.register<winston.Logger>(TokenInjection.LOGGER, {useValue: this.logger});
        container.register(TokenInjection.JWT_SECRET, {useValue: jwtSecret});
        container.register(TokenInjection.JWT_EXPIRATION, {useValue: jwtExpiration});
        container.register(TokenInjection.REFRESH_TOKEN_EXPIRATION, {useValue: refreshTokenExpiration});

        await this.dbInitialization(connectionName);

        let expressApp = express();
        expressApp = this.addExpressLoggingMiddleware(expressApp, this.logger);

        const apiRouter = this.createApiRoutes(express.Router());
        const spaRouter = this.serveSPA(express.Router());
        const mapsRouter = this.serveMaps(express.Router());

        expressApp.use("/api", apiRouter);
        expressApp.use("/maps", mapsRouter);
        expressApp.use(spaRouter);

        this.app = expressApp;
        this.server = http.createServer(expressApp);
        return this;
    }

    private async dbInitialization(connectionName: string) {
        const winstonOrm = new WinstonAdaptor(this.logger, "all");
        // Берем конфигу из ormconfig файла, и подменяем логгер на уже созданный единый логгер приложения
        this.dbConnection = await getConnectionOptions(connectionName)
            .then((connectionOpt) => {
                return createConnection(Object.assign(connectionOpt, {logger: winstonOrm}));
            });
        container.register<Connection>(Connection, {useValue: this.dbConnection});
    }

    private addExpressLoggingMiddleware(app: express.Express, logger: winston.Logger): express.Express {
        if (!app) {
            throw new Error("Nullref, app variable is undefined.");
        }
        // expressWinston.requestWhitelist.push('body');
        const expressLoggerOpt: expressWinston.LoggerOptions = {
            winstonInstance: logger,
            meta: true,
            // TODO: удалить обязательно, логировать бодики POST реквестов на продах крайне не желательно
            requestWhitelist: ["body"],
        };

        app.use(expressWinston.logger(expressLoggerOpt));

        return app;
    }

    private serveSPA(router: express.Router): express.Router {
        if (!router) {
            throw new Error("Nullref, router variable is undefined");
        }

        // TODO: разобраться с путями, слишком много относительных путей
        router.use(express.static(__dirname + "./../spa"));
        router.get("*", (request: express.Request, response: express.Response) => {
            response.sendFile(path.resolve(__dirname, "./../spa/index.html"));
        });

        return router;
    }

    private serveMaps(router: express.Router): express.Router {
        if (!router) {
            throw new Error("Nullref, router variable is undefined");
        }
        // TODO: разобраться с путями, слишком много относительных путей
        router.use(express.static(__dirname + "./../../maps"));
        return router;
    }

    private createApiRoutes(router: express.Router): express.Router {
        if (!router) {
            throw new Error("Express is not created.");
        }
        router.use(express.json());
        // TODO: вот это вот не точно, но скорее всего придется для SPA и прочей статики отдельный express.js поднимать, поэтому оставим пока так

        router.use(cors());

        this.routes.push(
            container.resolve(UsersRoutes),
            container.resolve(AuthRoutes),
            container.resolve(AgreementsRoutes),
        );

        this.routes.forEach((route) => {
            route.registerRoutes(router);
        });
        return router;
    }

    public start() {
        this.startingDate = new Date();

        this.server?.listen(this.port, () => {
            this.logger.info(`Server started at: http://${this.host}:${this.port}/`);
        });
        return this;
    }

    public stop() {
        if (!this.server) {
            this.logger.info("Server is not running, so it is Unstoppable.");
            return;
        }

        this.server.close((err) => {
            if (err) {
                this.logger.error(err);
            } else {
                this.logger.info("Successfully closed server.");
            }
        });
    }
}

// export default new GisApplication();
export {GisApplication};

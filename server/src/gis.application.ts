import "reflect-metadata";
import { container } from "tsyringe";

import path from "path";
import * as http from "http";

import express from "express"
import * as expressWinston from "express-winston";
import winston from "winston";

import { CommonRoutesConfig } from "./controllers/common.routes.config";
import { UsersRoutes } from "./controllers/users/users.routes.config";

class GisApplication {
    // TODO: strictPropertyInitialization как разберешься с текущим косяком, подумай о включении
    readonly app: express.Application;
    readonly port: number;
    readonly server: http.Server;
    readonly host: string;

    readonly logger: winston.Logger;
    readonly routes: Array<CommonRoutesConfig>;

    private startingDate?: Date;

    constructor(logger: winston.Logger, port: number, host?: string) {
        this.logger = logger;
        logger.info("Starting GameGis application");

        this.port = port;
        this.host = host ?? "localhost";
        this.routes = [];

        this.app = express();

        this.addExpressLoggingMiddleware(logger);
        this.serveStaticFiles();
        this.createRoutes();

        this.server = http.createServer(this.app);
    }

    private addExpressLoggingMiddleware(logger: winston.Logger) {
        const expressLoggerOpt: expressWinston.LoggerOptions = {
            winstonInstance: logger,
            meta: false
        }
        
        this.app.use(expressWinston.logger(expressLoggerOpt));
    }

    private serveStaticFiles() {
        if (!this.app) {
            return;
        }

        this.app.use(express.static(__dirname + "/spa"));
        this.app.get("/", (request: express.Request, response: express.Response) => {
            response.sendFile(path.resolve(__dirname, "spa/index.html"));
        });
    }

    private createRoutes() {
        if (!this.app) {
            return;
        }
        this.app.use(express.json());
        // вот это вот не точно, но скорее всего придется для SPA и прочей статики отдельный express.js поднимать, поэтому оставим пока так
        // import cors from "cors";
        // app.use(cors());

        // TODO: роуты экспрессу назначаются непрозрачно, шляпа повышающая порог вхождения
        // отдели создание роутов, от их присвоения
        container.register<express.Application>("ExpressJsApp", { useValue: this.app });

        this.routes.push(
            container.resolve(UsersRoutes)
        );
    }

    public start() {
        this.startingDate = new Date();

        this.server?.listen(this.port, () => {
            this.logger.info(`Server started at: http://${this.host}:${this.port}/`);
        });
    }

    public stop() {
        if (!this.server) {
            this.logger.info("Server is not running, could not stop.");
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
export { GisApplication };
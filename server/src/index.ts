import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";

import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";
import debug from "debug";

// Загрузили конфигу в глобальную переменную process
dotenv.config( {path: "./config/.env"} );

// Крутим логгер


// Стартуем express.js
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT || 3000;
const routes: Array<CommonRoutesConfig> = [];

// дебатабельная хуйня, покрути повнимательнее
const debugLog: debug.IDebugger = debug("app");

// Конфигурируем наш експресс.жс сервер

// here we are adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// вот это вот не точно, но скорее всего придется для SPA отдельный express.js поднимать, поэтому оставим пока так
// import cors from "cors";
// app.use(cors());

// winston логгер суем в экспресс
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({all: true})
    )
}

loggerOptions.meta = (process.env.RUNTIME === "DEBUG") ? true : false;

app.use(expressWinston.logger(loggerOptions));

// Добавляем роуты
routes.push(new UsersRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;

// TODO: не уверен в использовании статики и api на одном экспрессе
// Возможно имеет смысл попробовать запилить проксю
app.use(express.static(__dirname + "/spa"));
app.get("/", (request: express.Request, response: express.Response) => {
    response.sendFile(path.resolve(__dirname, "spa/index.html"));
});

// Запускаем сервер
server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    })
    console.log(runningMessage);
})

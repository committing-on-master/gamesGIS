import express, {NextFunction} from "express";
import winston from "winston";
import {ValidationChain, validationResult} from "express-validator";
import httpError, {HttpError} from "http-errors";

abstract class CommonMiddleware {
    protected readonly logger: winston.Logger;
    protected readonly name: string;

    constructor(logger: winston.Logger, name: string) {
        this.logger = logger;
        this.name = name;
        this.logger.info(`Creating middleware for: ${name}`);
        this.handleOperationalErrors = this.handleOperationalErrors.bind(this);
    }

    /**
     * Проверяет тело запроса на соответствие переданной схемы
     * @param {ValidationChain[] | ValidationChain} validation список схем, описывающих свойства запроса
     * @return {function} асинхронная middleware функция содержащая схему валидации
     */
    public validateRequestSchema(validation: ValidationChain[] | ValidationChain) {
        const validationChain: ValidationChain[] = [];
        if (Array.isArray(validation)) {
            validationChain.push(...validation);
        } else {
            validationChain.push(validation);
        }

        return async function(req: express.Request,
            res: express.Response,
            next: express.NextFunction) {
            await Promise.all(validationChain.map((validation) => validation.run(req)));

            const errors = validationResult(req);
            if (errors.isEmpty()) {
                return next();
            }
            throw httpError(400, "async validation error", {errors: errors.array()});
        };
    }

    public handleOperationalErrors(error: Error, req: express.Request, res: express.Response, next: NextFunction) {
        if (!httpError.isHttpError(error) || error.status === 500) {
            next(error);
        }
        const operationalError = error as HttpError;
        this.logger.warn(`[${this.name}] Operational Error: ${operationalError.message}`, operationalError);
        res
            .header("Content-Type", "application/json")
            .status(operationalError.statusCode)
            .send(JSON.stringify(operationalError));
    }
}

export {CommonMiddleware};

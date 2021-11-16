import express from "express";
import winston from "winston";
import { ValidationChain, validationResult } from "express-validator";

abstract class CommonMiddleware {
    protected readonly logger: winston.Logger;
    protected readonly name: string;

    constructor(logger: winston.Logger, name: string) {
        this.logger = logger;
        this.name = name;
        this.logger.info(`Creating middleware for: ${name}`);

    }

    /**
     * Проверяет тело запроса на соответствие переданной схемы 
     * @param validation список схем, описывающих свойства запроса
     */
    public validateRequestSchema(validation: ValidationChain[] | ValidationChain) {
        const validationChain: ValidationChain[] = [];
        if (Array.isArray(validation)) {
            validationChain.push(...validation);
        } else {
            validationChain.push(validation);
        }

        const scopedLogger = this.logger;
        const methodName = `[${this?.name}.validateRequestSchema]`

        return async function (req: express.Request,
                               res: express.Response,
                               next: express.NextFunction) {
            try {
                let result = await Promise.all(validationChain.map(validation => validation.run(req)));

                const errors = validationResult(req);
                if (errors.isEmpty()) {
                    return next();
                }
                res.status(400).json({ errors: errors.array() });
            } catch (error) {
                scopedLogger.error(methodName, error);
                return next(error)
            }
        }
    }
}

export { CommonMiddleware }
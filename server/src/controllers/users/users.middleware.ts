import express from 'express';
import { injectable } from 'tsyringe';
import { validationResult, body, checkSchema } from "express-validator";
import { ServicesLayer } from '../../services-layer/services.layer';
import { createUserDtoSchema } from './models.schema/create.user.dto.schema';

@injectable()
class UsersMiddleware {
    readonly services: ServicesLayer;

    constructor(services: ServicesLayer) {
        this.services = services;

        // методы уходят в мидлварю экспресса, биндим this
        this.validateSameEmailDoesntExist = this.validateSameEmailDoesntExist.bind(this);
        this.validateSameEmailBelongToSameUser = this.validateSameEmailBelongToSameUser.bind(this);
        this.validatePatchEmail = this.validatePatchEmail.bind(this);
        this.validateUserExists = this.validateUserExists.bind(this);
        this.extractUserId = this.extractUserId.bind(this);
        this.validateCreateUserSchema = this.validateCreateUserSchema.bind(this);
    }

    validationResult(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

    validateCreateUserSchema() {
        return checkSchema(createUserDtoSchema)
    }

    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        body()
        if (req.body && req.body.email && req.body.password) {
            next();
        } else {
            res.status(400).send({
                error: `Missing required fields email and password`,
            });
        }
    }

    async validateSameEmailDoesntExist(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await this.services.usersService.getUserByEmail(req.body.email);
        if (user) {
            res.status(400).send({ error: `User email already exists` });
        } else {
            next();
        }
    }

    async validateSameEmailBelongToSameUser(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user = await this.services.usersService.getUserByEmail(req.body.email);
        if (user && user.id?.toString() === req.params.userId) {
            next();
        } else {
            res.status(400).send({ error: `Invalid email` });
        }
    }

    // Here we need to use an arrow function to bind `this` correctly
    validatePatchEmail(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body.email) {
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };

    async validateUserExists(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (Number.isNaN(req.params?.userId)) {
            res.status(404).send({
                error: `User ${req.params.userId} not a number`,
            });
        }
        const user = await this.services.usersService.readById(parseInt(req.params.userId));
        if (user) {
            next();
        } else {
            res.status(404).send({
                error: `User ${req.params.userId} not found`,
            });
        }
    }

    async extractUserId(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        req.body.id = req.params.userId;
        next();
    }
}

export { UsersMiddleware };
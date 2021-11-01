import express from 'express';
import { DomainLayer } from '../../domain-layer/domain.layer';
import { injectable, singleton } from 'tsyringe';

@injectable()
class UsersMiddleware {
    readonly domainLayer: DomainLayer;

    constructor(domainLayer: DomainLayer) {
        this.domainLayer = domainLayer;

        // методы уходят в мидлварю экспресса, биндим this
        this.validateSameEmailDoesntExist = this.validateSameEmailDoesntExist.bind(this);
        this.validateSameEmailBelongToSameUser = this.validateSameEmailBelongToSameUser.bind(this);
        this.validatePatchEmail = this.validatePatchEmail.bind(this);
        this.validateUserExists = this.validateUserExists.bind(this);
        this.extractUserId = this.extractUserId.bind(this);
    }

    async validateRequiredUserBodyFields(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
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
        const user = await this.domainLayer.usersService.getUserByEmail(req.body.email);
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
        const user = await this.domainLayer.usersService.getUserByEmail(req.body.email);
        if (user && user.id === req.params.userId) {
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
        const user = await this.domainLayer.usersService.readById(req.params.userId);
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
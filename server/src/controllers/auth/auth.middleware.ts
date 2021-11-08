import express from 'express';
import * as argon2 from 'argon2';
import { ServicesLayer } from '../../services-layer/services.layer';
import { inject, injectable } from 'tsyringe';
import { CommonMiddleware } from '../common.middleware';
import { TokenInjection } from '../../infrastructure/token.injection';
import winston from 'winston';
import { body } from 'express-validator';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { Jwt } from '../common-types/jwt';

interface IUser {
    id: number;
    email: string;
    passwordHash: string;
    permissionLevel: number;
}

@injectable()
class AuthMiddleware extends CommonMiddleware {
    private readonly services: ServicesLayer;
    private readonly jwtSecret: string;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, 
                @inject(TokenInjection.JWT_SECRET) jwtSecret: string, 
                services: ServicesLayer) {
        super(logger, "AuthMiddleware");
        this.jwtSecret = jwtSecret;
        this.services = services;

        this.verifyUserPassword = this.verifyUserPassword.bind(this);
        this.validRefreshNeeded = this.validRefreshNeeded.bind(this);
        this.validJWTNeeded = this.validJWTNeeded.bind(this);
    }

    public authSchemaValidation() {
        return [
            body('email')
                .exists({checkNull: true}).withMessage("email body field is missing").bail()
                .isEmail().withMessage("email body field has wrong Email format").bail(),
            body('password')
                .exists({checkNull: true}).withMessage("password body field is missing").bail()
                // .isStrongPassword({
                //     minLength: 6,
                //     minLowercase: 0,
                //     minUppercase: 0,
                //     minNumbers: 0,
                //     minSymbols: 3
                // })
                .isLength({min: 6, max: 16}).withMessage("password field must contain more then 6 symbols and less then 16 symbols").bail()
        ]
    }

    public async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let user: IUser | undefined = await this.services.usersService.getUserByEmail(req.body.email);
        if (user) {
            const passwordHash = user.passwordHash;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    userId: user.id,
                    email: user.email,
                    permissionLevel: user.permissionLevel,
                };
                return next();
            }
        }
        // Giving the same message in both cases
        // helps protect against cracking attempts:
        res.status(400).send({ errors: ['Invalid email and/or password'] });
    }

    public verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body?.refreshToken) {
            return next();
        } else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] });
        }
    }

    async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const user:any = await this.services.usersService.getUserByEmail(res.locals.jwt.email);
            const salt = crypto.createSecretKey(Buffer.from(res.locals.jwt.refreshKey.data));
            const hash = crypto
                .createHmac('sha512', salt)
                .update(res.locals.jwt.userId + this.jwtSecret)
                .digest('base64');
            if (hash === req.body.refreshToken) {
                req.body = {
                    userId: user._id,
                    email: user.email,
                    permissionFlags: user.permissionFlags,
                };
                return next();
            } else {
                return res.status(400).send({ errors: ['Invalid refresh token'] });
            }
        } catch (error) {
            this.logger.error('AuthMiddleware.validRefreshNeeded', error);
            return res.status(500).send();
        }
    }

    public validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    res.locals.jwt = jwt.verify(
                        authorization[1],
                        this.jwtSecret
                    ) as Jwt;
                    next();
                }
            } catch (err) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }
}

export { AuthMiddleware }
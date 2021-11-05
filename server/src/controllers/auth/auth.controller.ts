import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { inject, singleton } from 'tsyringe';
import { TokenInjection } from '../../infrastructure/token.injection';
import winston from 'winston';
import { CommonController } from '../common.controller';

@singleton()
class AuthController extends CommonController {
    private readonly jwtSecret: string;
    private readonly tokenExpirationInSeconds: number;
    
    constructor(@inject(TokenInjection.LOGGER)logger: winston.Logger,
                @inject(TokenInjection.JWT_SECRET)jwtSecret: string,
                @inject(TokenInjection.JWT_EXPIRATION)tokenExpirationInSeconds: number) {
        super(logger, "AuthController");

        this.jwtSecret = jwtSecret;
        this.tokenExpirationInSeconds = tokenExpirationInSeconds;

        this.createJWT = this.createJWT.bind(this);
    }

    async createJWT(req: express.Request, res: express.Response) {
        try {
            const refreshId = req.body.userId + this.jwtSecret;
            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const hash = crypto
                .createHmac('sha512', salt)
                .update(refreshId)
                .digest('base64');
            req.body.refreshKey = salt.export();
            const token = jwt.sign(req.body, this.jwtSecret, {
                expiresIn: this.tokenExpirationInSeconds,
            });
            return res
                .status(201)
                .send({ accessToken: token, refreshToken: hash });
        } catch (err) {
            this.logger.error('createJWT error', err);
            return res.status(500).send();
        }
    }
}

export { AuthController }
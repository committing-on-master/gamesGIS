import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as argon2 from 'argon2';
import { inject, singleton } from 'tsyringe';
import { TokenInjection } from '../../infrastructure/token.injection';
import winston from 'winston';
import { CommonController } from '../common.controller';
import { ServicesLayer } from '../../services-layer/services.layer';

interface IUser {
    id: number;
    email: string;
    passwordHash: string;
    permissionLevel: number;
}

@singleton()
class AuthController extends CommonController {
    private readonly jwtSecret: string;
    private readonly tokenExpirationInSeconds: number;
    private readonly services: ServicesLayer;
    
    constructor(@inject(TokenInjection.LOGGER)logger: winston.Logger,
                @inject(TokenInjection.JWT_SECRET)jwtSecret: string,
                @inject(TokenInjection.JWT_EXPIRATION)tokenExpirationInSeconds: number,
                services: ServicesLayer) {
        super(logger, "AuthController");

        this.jwtSecret = jwtSecret;
        this.tokenExpirationInSeconds = tokenExpirationInSeconds;
        this.services = services;

        this.createJWT = this.createJWT.bind(this);
    }

    public async createJWT(req: express.Request, res: express.Response) {
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

    private async verifyUserPassword(email: string, password: string): Promise<boolean> {
        let user: IUser | undefined = await this.services.usersService.getUserByEmail(email);
        if (user) {
            const passwordHash = user.passwordHash;
            if (await argon2.verify(passwordHash, password)) {
                return true;
            }
        }
        return false;
    }
}

export { AuthController }
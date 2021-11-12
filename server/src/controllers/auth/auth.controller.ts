import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as argon2 from 'argon2';
import { inject, singleton } from 'tsyringe';
import { TokenInjection } from '../../infrastructure/token.injection';
import winston from 'winston';
import { CommonController } from '../common.controller';
import { ServicesLayer } from '../../services-layer/services.layer';
import { JwtPayload } from '../common-types/jwt.payload';
import { body } from 'express-validator';

interface IUser {
    id: number;
    email: string;
    passwordHash: string;
    permissionFlag: number;
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
        this.revokeRefreshToken = this.revokeRefreshToken.bind(this);
    }    

    /**
     * Создание access и refresh token-ов
     */
    public async createJWT(req: express.Request, res: express.Response) {
        try {
            const userId = parseInt(req.body?.userId);
            const user = await this.services.usersService.getUserById(userId);
            if (!user) {
                return res.status(404).send({errors: ["user is not exist"]})
            }

            let jwtPayload: JwtPayload = {
                userId: user.id,
                permissionFlag: user.permissionFlag
            };

            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const refreshToken = crypto.createHmac('sha512', salt)
                                       .update(user.email)
                                       .digest('base64');
            
            const token = jwt.sign(jwtPayload, this.jwtSecret, { expiresIn: this.tokenExpirationInSeconds });
            await this.services.usersService.updateUserRefreshToken(userId, refreshToken);

            return res
                .status(201)
                .send({ accessToken: token, refreshToken: refreshToken });
        } catch (err) {
            this.logger.error('createJWT error', err);
            return res.status(500).send();
        }
    }

    /**
     * Отзыв refresh token-а пользователя
     */
    public async revokeRefreshToken(req: express.Request, res: express.Response) {
        try {
            const jwtPayload = res.locals.jwt as JwtPayload;
            const user = await this.services.usersService.getUserById(jwtPayload.userId);
            if (!user) {
                return res.status(404).send({errors: ["user is not exist"]})
            }
            const refreshToken = await this.services.usersService.getRefreshTokenByUserId(jwtPayload.userId);
            if (!refreshToken) {
                return res.status(410).send();
            }
            await this.services.usersService.revokeUserRefreshToken(jwtPayload.userId);
            return res.status(200).send();
        } catch (error) {
            this.logger.error(`${this.name}.revokeRefreshToken`, error);
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
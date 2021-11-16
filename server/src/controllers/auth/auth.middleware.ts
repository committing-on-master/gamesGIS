import express from 'express';
import * as argon2 from 'argon2';
import { ServicesLayer } from '../../services-layer/services.layer';
import { inject, injectable } from 'tsyringe';
import { CommonMiddleware } from '../common.middleware';
import { TokenInjection } from '../../infrastructure/token.injection';
import winston from 'winston';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import { JwtPayload } from '../common-types/jwt.payload';

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
        this.verifyRefreshToken = this.verifyRefreshToken.bind(this);
        // this.validJWTNeeded = this.validJWTNeeded.bind(this);
    }

    public async verifyUserPassword(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const user = await this.services.usersService.getUserByEmail(req.body.email);
            if (user) {
                const passwordHash = user.passwordHash;
                if (await argon2.verify(passwordHash, req.body.password)) {
                    res.locals.user = user;
                    return next();
                }
            }
            res.status(403).send({ errors: ['Invalid email and/or password'] });
        } catch (error) {
            this.logger.error(`${this.name}.verifyUserPassword`, error);
            next(error);
        }
    }

    /**
     * Проверка наличия refresh токена
     */
    public verifyRefreshTokenBodyField(
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

    /**
     * Проверяем полученный refresh token с ранее сгенерированным эталоном
     */
    public async verifyRefreshToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const jwtPayload = res.locals.jwt as JwtPayload;
            const savedRefreshToken = await this.services.usersService.getRefreshTokenByUserId(jwtPayload.userId);
            if (!savedRefreshToken) {
                let message = `[${this.name}.validRefreshNeeded] refresh token not found, but access token exist`;
                this.logger.error(message);
                return next({ errors: [message] });
            }
            if (req.body?.refreshToken !== savedRefreshToken.token) {
                return res.status(400).send({ errors: ["Invalid refresh token"] });
            }
            // проверка на отзыва refresh токена
            if (savedRefreshToken.revoked || ((savedRefreshToken.expiredDate < new Date()))) {
                return res.status(401).send({ errors: ["refresh token was revoked or expired"] });
            }
            let user = await this.services.usersService.getUserById(jwtPayload.userId);
            if (!user) {
                let message = `[${this.name}.validRefreshNeeded] refresh token exist, but user don't`;
                this.logger.error(message);
                return next({ errors: [message] });
            }
            res.locals.user = user;
            return next();
        } catch (error) {
            this.logger.error(`[${this.name}.validRefreshNeeded]`, error);
            return next(error);
        }
    }

    /**
     * Валидация JWT токена при запросе
     * @param options опции валидации, которые можно задать для данного конкретного route-а
     */
    public jwtTokenValidation(options: VerifyOptions = {}){
        const execParam = {
            options: options,
            jwtSecret: this.jwtSecret
        };
        return function(req: express.Request,
                        res: express.Response,
                        next: express.NextFunction) {
            if (req.headers['authorization']) {
                try {
                    const authorization = req.headers['authorization'].split(' ');
                    if (authorization[0] !== 'Bearer') {
                        return res.status(401).send();
                    } else {
                        res.locals.jwt = jwt.verify(
                            authorization[1],
                            execParam.jwtSecret,
                            execParam.options
                        ) as JwtPayload;
                        return next();
                    }
                } catch (err) {
                    return next(err);
                }
            } else {
                return res.status(401).send({});
            }
        }   
    }

    /**
     * Получает из заголовка jwt объект, проверяет подлинность его подписи
     */
    // public validJWTNeeded(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction
    // ) {
    //     if (req.headers['authorization']) {
    //         try {
    //             const authorization = req.headers['authorization'].split(' ');
    //             if (authorization[0] !== 'Bearer') {
    //                 return res.status(401).send();
    //             } else {
    //                 res.locals.jwt = jwt.verify(
    //                     authorization[1],
    //                     this.jwtSecret
    //                 ) as JwtPayload;
    //                 next();
    //             }
    //         } catch (err) {
    //             return res.status(403).send();
    //         }
    //     } else {
    //         return res.status(401).send();
    //     }
    // }
}

export { AuthMiddleware }
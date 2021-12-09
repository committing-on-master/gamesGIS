import express from "express";
import * as argon2 from "argon2";
import {ServicesLayer} from "../../services-layer/services.layer";
import {inject, injectable} from "tsyringe";
import {CommonMiddleware} from "../common.middleware";
import {TokenInjection} from "../../infrastructure/token.injection";
import winston from "winston";
import jwt, {VerifyOptions} from "jsonwebtoken";
import {JwtPayload} from "../common-types/jwt.payload";
import {ResponseBody} from "../response.body";

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
        next: express.NextFunction,
    ) {
        try {
            const user = await this.services.Users.getUserByEmail(req.body.email);
            if (user) {
                const passwordHash = user.passwordHash;
                if (await argon2.verify(passwordHash, req.body.password)) {
                    res.locals.user = user;
                    return next();
                }
            }
            res.status(403).send(ResponseBody.jsonError("Invalid email and/or password"));
        } catch (error) {
            this.logger.error(`${this.name}.verifyUserPassword`, error);
            next(error);
        }
    }

    /**
     * Проверка наличия refresh токена
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @return {void}
     */
    // public verifyRefreshTokenBodyField(
    //     req: express.Request,
    //     res: express.Response,
    //     next: express.NextFunction,
    // ) {
    //     if (req.body?.refreshToken) {
    //         return next();
    //     } else {
    //         return res
    //             .status(400)
    //             .send({errors: ["Missing required field: refreshToken"]});
    //     }
    // }

    /**
     * Проверяем полученный refresh token с ранее сгенерированным эталоном
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @return {void}
     */
    public async verifyRefreshToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const userId = parseInt(req.body.id, 10);
            const savedRefreshToken = await this.services.Users.getRefreshTokenByUserId(userId);
            if (!savedRefreshToken) {
                const message = `[${this.name}.validRefreshNeeded] refresh token not found, but access token exist`;
                this.logger.error(message);
                return next({errors: [message]});
            }
            if (req.body?.refreshToken !== savedRefreshToken.token) {
                return res.status(400).send({errors: ["Invalid refresh token"]});
            }
            // проверка на отзыва refresh токена
            if (savedRefreshToken.revoked || ((savedRefreshToken.expiredDate < new Date()))) {
                return res.status(401).send({errors: ["refresh token was revoked or expired"]});
            }
            const user = await this.services.Users.getUserById(userId);
            if (!user) {
                const message = `[${this.name}.validRefreshNeeded] refresh token exist, but user don't`;
                this.logger.error(message);
                return next({errors: [message]});
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
     * @param {VerifyOptions} options опции валидации, которые можно задать для данного конкретного route-а
     * @return {function} middleware функция по валидации токена с учетом полученных параметров
     */
    public jwtTokenValidation(options: VerifyOptions = {}) {
        const execParam = {
            options: options,
            jwtSecret: this.jwtSecret,
        };
        return function(req: express.Request,
            res: express.Response,
            next: express.NextFunction) {
            if (req.headers["authorization"]) {
                try {
                    const authorization = req.headers["authorization"].split(" ");
                    if (authorization[0] !== "Bearer") {
                        return res.status(401).send();
                    } else {
                        res.locals.jwt = jwt.verify(
                            authorization[1],
                            execParam.jwtSecret,
                            execParam.options,
                        ) as JwtPayload;
                        return next();
                    }
                } catch (err) {
                    return next(err);
                }
            } else {
                return res.status(401).send({});
            }
        };
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

export {AuthMiddleware};

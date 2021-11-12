import express from 'express';
import * as argon2 from 'argon2';
import { ServicesLayer } from '../../services-layer/services.layer';
import { inject, injectable } from 'tsyringe';
import { CommonMiddleware } from '../common.middleware';
import { TokenInjection } from '../../infrastructure/token.injection';
import winston from 'winston';
import { body } from 'express-validator';
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
        try {
            const user = await this.services.usersService.getUserByEmail(req.body.email);            
            if (user) {
                const passwordHash = user.passwordHash;
                if (await argon2.verify(passwordHash, req.body.password)) {
                    req.body.userId = user.id;
                    return next();
                }
            }
            res.status(403).send({ errors: ['Invalid email and/or password'] });
        } catch (error) {
            this.logger.error(`${this.name}.verifyUserPassword`, error);
            return res.status(500).send();
        }
    }

    /**
     * Проверка наличия refresh токена
     */
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

    /**
     * Проверяем полученный refresh token с ранее сгенерированным эталоном
     */
    public async validRefreshNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const jwtPayload = res.locals.jwt as JwtPayload;
            const savedRefreshToken = await this.services.usersService.getRefreshTokenByUserId(jwtPayload.userId);
            if (!savedRefreshToken) {
                this.logger.error(`${this.name}.validRefreshNeeded refresh token not found, but access token exist`);
                return res.status(500).send();
            }
            if (savedRefreshToken.revoked || ((savedRefreshToken.expiredDate < new Date()))) {
                return res.status(401).send({ errors: ["refresh token was revoked or expired"] });
            }
            if (req.body?.refreshToken === savedRefreshToken.token) {
                let user = await this.services.usersService.getUserById(jwtPayload.userId);
                if (!user) {
                    return res.status(404).send({errors: ["user is not exist"]});
                }
                req.body.userId = jwtPayload.userId;
                req.body.email = user.email;

                next();
            } else {
                return res.status(400).send({ errors: ["Invalid refresh token"] });
            }
        } catch (error) {
            this.logger.error(`${this.name}.validRefreshNeeded`, error);
            return res.status(500).send();
        }
    }

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

    /**
     * Получает из заголовка jwt объект, проверяет подлинность его подписи
     */
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
                    ) as JwtPayload;
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
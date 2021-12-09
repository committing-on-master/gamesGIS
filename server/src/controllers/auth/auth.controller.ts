import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {inject, singleton} from "tsyringe";
import {TokenInjection} from "../../infrastructure/token.injection";
import winston from "winston";
import {CommonController} from "../common.controller";
import {ServicesLayer} from "../../services-layer/services.layer";
import {JwtPayload} from "../common-types/jwt.payload";
import {UsersDAO} from "./../../data-layer/models/users.dao";
import {ResponseBody} from "../response.body";

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
     * @param {express.Request} req
     * @param {express.Response} res
     */
    public async createJWT(req: express.Request, res: express.Response) {
        try {
            const user:UsersDAO = res.locals.user;
            const jwtPayload: JwtPayload = {
                userId: user.id,
                userName: user.name,
                permissionFlag: user.permissionFlag,
            };

            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const refreshToken = crypto.createHmac("sha512", salt)
                .update(user.email)
                .digest("base64");

            const token = jwt.sign(jwtPayload, this.jwtSecret, {expiresIn: this.tokenExpirationInSeconds});
            await this.services.Users.updateUserRefreshToken(user.id, refreshToken);

            const jwtResponseDTO = {
                accessToken: token,
                refreshToken: refreshToken,
            };

            return res
                .status(201)
                .send(ResponseBody.jsonOk("jwt created", jwtResponseDTO));
        } catch (err) {
            this.logger.error("createJWT error", err);
            return res.status(500).send({});
        }
    }

    /**
     * Отзыв refresh token-а пользователя
     * @param {express.Request} req
     * @param {express.Response} res
     */
    public async revokeRefreshToken(req: express.Request, res: express.Response) {
        try {
            const jwtPayload = res.locals.jwt as JwtPayload;
            const user = await this.services.Users.getUserById(jwtPayload.userId);
            if (!user) {
                return res.status(404).send({errors: ["user is not exist"]});
            }
            const refreshToken = await this.services.Users.getRefreshTokenByUserId(jwtPayload.userId);
            if (!refreshToken) {
                return res.status(410).send();
            }
            await this.services.Users.revokeUserRefreshToken(jwtPayload.userId);
            return res.status(200).send();
        } catch (error) {
            this.logger.error(`[${this.name}.revokeRefreshToken]`, error);
            return res.status(500).send();
        }
    }
}

export {AuthController};

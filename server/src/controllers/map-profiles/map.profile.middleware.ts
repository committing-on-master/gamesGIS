import {inject, injectable} from "tsyringe";
import winston from "winston";
import express from "express";
import httpErrors from "http-errors";

import {CommonMiddleware} from "../common.middleware";
import {TokenInjection} from "../../infrastructure/token.injection";
import {ServicesLayer} from "./../../services-layer/services.layer";
import {JwtPayload} from "../common-types/jwt.payload";

@injectable()
class MapProfileMiddleware extends CommonMiddleware {
    readonly services: ServicesLayer;
    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
        services: ServicesLayer,
    ) {
        super(logger, "MapProfileMiddleware");
        this.services = services;

        this.validateProfileNameAuthorship = this.validateProfileNameAuthorship.bind(this);
        this.validateProfileIdAuthorship = this.validateProfileIdAuthorship.bind(this);
    }

    /**
     * Проверяет, что запрос на внесение изменений в профиль карты пришел от того же пользователя
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     * @return {void}
     * */
    public async validateProfileNameAuthorship(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const profileName: string = req.body.profileName;
        const userId = await this.services.MapProfiles.getAuthorIdByProfileName(profileName);
        if (!userId) {
            throw new httpErrors[404](`Profile with name "${profileName}" not found`);
        }

        const jwtToken = res.locals.jwt as JwtPayload;
        if (userId === jwtToken.userId) {
            return next();
        }
        throw new httpErrors.Forbidden("You do not have permission to edit this map profile");
    }

    public async validateProfileIdAuthorship(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        const profileId: number = req.body.profileId;
        const userId = await this.services.MapProfiles.getAuthorIdByProfileId(profileId);
        if (!userId) {
            throw new httpErrors[404](`Profile with id "${profileId}" not found`);
        }

        const jwtToken = res.locals.jwt as JwtPayload;
        if (userId === jwtToken.userId) {
            return next();
        }
        throw new httpErrors.Forbidden("You do not have permission to edit this map profile");
    }
}

export {MapProfileMiddleware};

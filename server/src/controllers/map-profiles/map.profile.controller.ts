import express from "express";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {ServicesLayer} from "./../../services-layer/services.layer";
import {inject, singleton} from "tsyringe";
import winston from "winston";
import httpErrors from "http-errors";

import {CommonController} from "../common.controller";
import {JwtPayload} from "../common-types/jwt.payload";

@singleton()
class MapProfileController extends CommonController {
    readonly services: ServicesLayer;
    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "MapProfileController");

        this.services = services;

        this.createProfile = this.createProfile.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }
    public async createProfile(req: express.Request, res: express.Response) {
        const userId = (res.locals.jwt as JwtPayload).userId;
        await this.services.MapProfiles.createProfile(req.body, userId);
        res.status(200).send({});
    }

    public async getProfile(req: express.Request, res: express.Response) {
        const profileName: string = req.body.profileName;
        const profile = await this.services.MapProfiles.getProfile(profileName);
        if (!profile) {
            throw new httpErrors.NotFound(`map profile with name: "${profileName}" not found`);
        }

        return res
            .status(200)
            .json({payload: profile});
    }
}

export {MapProfileController};

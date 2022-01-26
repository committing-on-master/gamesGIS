import express from "express";
import {inject, singleton} from "tsyringe";
import winston from "winston";
import httpErrors from "http-errors";

import {TokenInjection} from "./../../infrastructure/token.injection";
import {ServicesLayer} from "./../../services-layer/services.layer";
import {CommonController} from "../common.controller";
import {JwtPayload} from "../common-types/jwt.payload";
import {MarkerDto} from "./../../services-layer/map-profile/models/marker.dto";
import {MarkerDao} from "src/data-layer/models/marker.dao";

@singleton()
class MapProfileController extends CommonController {
    readonly services: ServicesLayer;
    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "MapProfileController");

        this.services = services;

        this.createProfile = this.createProfile.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.getMarkers = this.getMarkers.bind(this);
        this.createMarker = this.createMarker.bind(this);
        this.updateMarker = this.updateMarker.bind(this);
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

    public async getMarkers(req: express.Request, res: express.Response) {
        const profileName: string = req.body.profileName;
        const markers = await this.services.MapProfiles.getMarkersByProfileName(profileName);
        const response = markers.map((value) => this.mapMarker(value));
        return res.status(200).json({message: "ok", payload: response});
    }

    public async createMarker(req: express.Request, res: express.Response) {
        const profileName: string = req.body.profileName;

        const saved = await this.services.MapProfiles.createMarker(profileName, req.body);
        const response: MarkerDto = this.mapMarker(saved);

        this.logger.info(`New marker with id - name: ${response.id} - ${response.name} for profile: ${profileName} is created`);
        return res.status(200).json({message: "ok", payload: response});
    }

    private mapMarker(marker: MarkerDao): MarkerDto {
        return {
            id: marker.id,
            name: marker.name,
            description: marker.description,
            color: marker.areaColor,
            position: {
                x: marker.xCoordinate,
                y: marker.yCoordinate,
            },
            bound: marker.area.map((value) => {
                return {
                    x: value.xCoordinate,
                    y: value.yCoordinate,
                };
            }),
        };
    }

    public async updateMarker(req: express.Request, res: express.Response) {
        throw new Error("Method not implemented.");
    }
}

export {MapProfileController};

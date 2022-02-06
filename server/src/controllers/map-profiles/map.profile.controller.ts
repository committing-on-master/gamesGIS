import express from "express";
import {inject, singleton} from "tsyringe";
import winston from "winston";
import httpErrors from "http-errors";

import {TokenInjection} from "./../../infrastructure/token.injection";
import {ServicesLayer} from "./../../services-layer/services.layer";
import {CommonController} from "../common.controller";
import {JwtPayload} from "../common-types/jwt.payload";
import {MarkerDto} from "../../dto/response/marker.dto";
import {MarkerDao} from "src/data-layer/models/marker.dao";
import {MapProfileReviewDTO} from "src/dto/response/map.profile.review.dto";

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
        this.deleteMarker = this.deleteMarker.bind(this);
        this.getProfiles = this.getProfiles.bind(this);
        this.getReviewProfiles = this.getReviewProfiles.bind(this);
        this.deleteMapProfile = this.deleteMapProfile.bind(this);
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

        this.logger.info(`Create. New marker with id - name: ${response.id} - ${response.name} for profile: ${profileName} is created`);
        return res.status(200).json({message: "ok", payload: response});
    }

    public async updateMarker(req: express.Request, res: express.Response) {
        const profileName: string = req.body.profileName;
        const markerId: number = req.body.markerId;

        const updated = await this.services.MapProfiles.updateMarker(profileName, markerId, req.body);
        const response: MarkerDto = this.mapMarker(updated);

        this.logger.info(`Updated. Marker with id - name: ${response.id} - ${response.name} for profile: ${profileName} is updated`);
        return res.status(200).json({message: "ok", payload: response});
    }

    public async deleteMapProfile(req: express.Request, res: express.Response) {
        const profileId: number = req.body.profileId;
        await this.services.MapProfiles.deleteProfile(profileId);
        return res.status(200).json({message: "resource deleted successfully"});
    }
    public async updateMapProfile(req: express.Request, res: express.Response) {
        throw new Error("Method updateMapProfile not implemented.");
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

    public async deleteMarker(req: express.Request, res: express.Response) {
        const markerId: number = req.body.markerId;

        await this.services.MapProfiles.deleteMarker(markerId);
        return res.status(200).json({message: "ok"});
    }

    public async getProfiles(req: express.Request, res: express.Response) {
        const nameQuery = req.query.name;
        if (nameQuery && typeof nameQuery === "string") {
            const result = await this.services.MapProfiles.getProfile(nameQuery);
            if (!result) {
                throw new httpErrors.NotFound(`map profile with name: ${nameQuery} not found`);
            }
            return res.status(200).json({message: "ok", payload: result});
        }
        throw new httpErrors.NotAcceptable("getting all maps profiles is not currently allowed");
    }

    public async getReviewProfiles(req: express.Request, res: express.Response) {
        const userId = req.query.userId;
        if (userId && typeof userId === "string") {
            const parsedId = parseInt(userId, 10);
            if (Number.isInteger(parsedId)) {
                const mapProfiles = await this.services.MapProfiles.getProfilesByUserId(parseInt(userId, 10));
                const response: MapProfileReviewDTO[] = mapProfiles.map((value) => {
                    return {
                        id: value.id,
                        map: value.map.mapType,
                        creationDate: value.creationDate,
                        name: value.name,
                        markersCount: value.markers ? value.markers.length : 0,
                    };
                });
                return res.status(200).json({message: "ok", payload: response});
            }
            throw new httpErrors.BadRequest(`userId parameter: ${userId} is not a integer`);
        }
        throw new httpErrors.NotAcceptable("getting all maps profiles is not currently allowed");
    }
}

export {MapProfileController};

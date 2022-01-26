import {DataLayer} from "./../../data-layer/data.layer";
import winston from "winston";
import {inject, singleton} from "tsyringe";

import {MapProfileDto} from "./models/map.profile.dto";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {MapProfileDao} from "./../../data-layer/models/map.profile.dao";
import {Profile} from "./models/profile";
import {MarkerDto} from "./models/marker.dto";
import {MarkerDao} from "./../../data-layer/models/marker.dao";
import {CoordinatesDao} from "./../../data-layer/models/coordinates.dao";

@singleton()
class MapProfileService {
    private readonly logger: winston.Logger;
    private readonly dataLayer: DataLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
        dataLayer: DataLayer) {
        this.logger = logger;
        this.logger.info("MapProfileService creation");

        this.dataLayer = dataLayer;
    }

    public async getProfile(profileName: string) {
        const profile = await this.dataLayer.mapProfileRepository.findProfileByName(profileName, ["map", "user"]);
        if (!profile) {
            return profile;
        }
        if (!profile.map) {
            throw new Error(`There is no param for mapType: ${profile.map}`);
        }
        const result: Profile = {
            id: profile.id,
            name: profile.name,
            mapType: profile.map.mapType,

            center: {
                x: profile.map.center.X,
                y: profile.map.center.Y,
            },
            bound: [
                {
                    x: profile.map.leftBottom.X,
                    y: profile.map.leftBottom.Y,
                },
                {
                    x: profile.map.rightTop.X,
                    y: profile.map.rightTop.Y,
                },
            ],
            maxLayers: profile.map.layers,
            currentLayer: profile.map.defaultLayer,
            userId: profile.user.id,

            minZoom: profile.map.minZoom,
            maxZoom: profile.map.maxZoom,
        };
        return result;
    }

    public async createProfile(dto: MapProfileDto, userId: number) {
        this.logger.info(`Creating map profile with name: ${dto.profileName}.`);
        const user = await this.dataLayer.usersRepository.findUserById(userId);
        if (!user) {
            throw new Error(`User with id: ${userId} not found.`);
        }

        const map = await this.dataLayer.mapRepository.getMapByType(dto.map);
        if (!map) {
            throw new Error(`There is no data for given map type: ${dto.map}.`);
        }

        const mapProfileDao= new MapProfileDao();
        mapProfileDao.name = dto.profileName;
        mapProfileDao.map = map;
        mapProfileDao.user = user;

        await this.dataLayer.mapProfileRepository.createProfile(mapProfileDao);
        this.logger.info(`Map profile with name: "${dto.profileName}" created.`);
    }

    public async isNameExist(profileName: string): Promise<boolean> {
        return this.dataLayer.mapProfileRepository.isProfileExist(profileName);
    };

    public async getProfileAuthorId(profileName: string): Promise<number | undefined> {
        return this.dataLayer.mapProfileRepository.getAuthorIdByProfileName(profileName);
    }

    public async createMarker(profileName: string, marker: MarkerDto) {
        const profile = await this.dataLayer.mapProfileRepository.findProfileByName(profileName);
        if (!profile) {
            throw new Error(`map profile with name: "${profileName}" not found`);
        }

        const newEntry = new MarkerDao();
        newEntry.name = marker.name;
        newEntry.description = marker.description ? marker.description : "";
        newEntry.xCoordinate = marker.position.x;
        newEntry.yCoordinate = marker.position.y;
        newEntry.areaColor = marker.color;

        newEntry.area = marker.bound.map((value, index) => {
            const point = new CoordinatesDao();
            point.xCoordinate = value.x;
            point.yCoordinate = value.y;
            point.marker = newEntry;
            return point;
        });

        newEntry.gallery = [];
        newEntry.profile = profile;

        return this.dataLayer.ContextManager.transaction(async (transactionalEntityManager) => {
            const saved = await transactionalEntityManager.save(newEntry);
            saved.area = await transactionalEntityManager.save(newEntry.area);
            return saved;
        });
    }

    public async getMarkersByProfileName(profileName: string) {
        return this.dataLayer.markerRepository.getMarkersWithAreasByProfileName(profileName);
    }
}
export {MapProfileService};

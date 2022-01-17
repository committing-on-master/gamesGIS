import {DataLayer} from "./../../data-layer/data.layer";
import winston from "winston";
import {inject, singleton} from "tsyringe";

import {MapProfileDto} from "./models/map.profile.dto";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {MapProfileDao} from "./../../data-layer/models/map.profile.dao";
import {Profile} from "./models/profile";

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
        const profile = await this.dataLayer.mapProfileRepository.findProfileByName(profileName, ["map"]);
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
}
export {MapProfileService};

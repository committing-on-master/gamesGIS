import {DataLayer} from "./../../data-layer/data.layer";
import winston from "winston";
import {inject, singleton} from "tsyringe";
import httpErrors from "http-errors";

import {MapProfileDto} from "../../dto/request/map.profile.dto";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {MapProfileDao} from "./../../data-layer/models/map.profile.dao";
import {Point, Profile} from "../../dto/response/profile";
import {MarkerDto} from "../../dto/response/marker.dto";
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
            throw new httpErrors.NotFound(`There is no param for mapType: ${profile.map}`);
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
            throw new httpErrors.NotFound(`User with id: ${userId} not found.`);
        }

        const map = await this.dataLayer.mapRepository.getMapByType(dto.map);
        if (!map) {
            throw new httpErrors.NotFound(`There is no data for given map type: ${dto.map}.`);
        }

        const mapProfileDao = new MapProfileDao();
        mapProfileDao.name = dto.profileName;
        mapProfileDao.map = map;
        mapProfileDao.user = user;

        await this.dataLayer.mapProfileRepository.createProfile(mapProfileDao);
        this.logger.info(`Map profile with name: "${dto.profileName}" created.`);
    }

    public async isNameExist(profileName: string): Promise<boolean> {
        return this.dataLayer.mapProfileRepository.isProfileExist(profileName);
    };

    public async getAuthorIdByProfileName(profileName: string): Promise<number | undefined> {
        return this.dataLayer.mapProfileRepository.getAuthorIdByProfileName(profileName);
    }

    public async createMarker(profileName: string, marker: MarkerDto) {
        const profile = await this.dataLayer.mapProfileRepository.findProfileByName(profileName);
        if (!profile) {
            throw new httpErrors.NotFound(`map profile with name: "${profileName}" not found`);
        }

        const newEntry = this.mapMarkerDtoToDao(marker);
        newEntry.gallery = [];
        newEntry.profile = profile;

        return this.dataLayer.ContextManager.transaction(async (transactionalEntityManager) => {
            const saved = await transactionalEntityManager.save(newEntry);
            saved.area = await transactionalEntityManager.save(newEntry.area);
            return saved;
        });
    }

    public async updateMarker(profileName: string, markerId: number, updatedMarker: MarkerDto): Promise<MarkerDao> {
        const profile = await this.dataLayer.mapProfileRepository.findProfileByName(profileName);
        if (!profile) {
            throw new httpErrors.NotFound(`map profile with name: "${profileName}" not found`);
        }

        let saved = await this.dataLayer.markerRepository.findMarkerById(markerId, ["area"]);
        if (!saved) {
            throw new httpErrors.NotFound(`marker with id: ${markerId} not found`);
        }

        saved.name = updatedMarker.name;
        saved.description = updatedMarker.description ? updatedMarker.description : "";
        saved.areaColor = updatedMarker.color;
        saved.xCoordinate = updatedMarker.position.x;
        saved.yCoordinate = updatedMarker.position.y;

        const newArea = this.mapAreaCoordinatesDtoToDao(updatedMarker.bound);

        const queryRunner = this.dataLayer.createQueryRunner();
        try {
            queryRunner.startTransaction();
            await queryRunner.manager.remove(saved.area);
            saved = await queryRunner.manager.save(saved);
            newArea.forEach((value) => value.marker = saved!);
            saved.area = await queryRunner.manager.save(newArea);

            await queryRunner.commitTransaction();
            return saved;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    public async getMarkersByProfileName(profileName: string) {
        return this.dataLayer.markerRepository.getMarkersWithAreasByProfileName(profileName);
    }

    public async getAuthorIdByProfileId(profileId: number) {
        return this.dataLayer.mapProfileRepository.getAuthorIdByProfileId(profileId);
    }

    public async deleteMarker(markerId: number) {
        const marker = await this.dataLayer.markerRepository.findMarkerById(markerId, ["area"]);
        if (!marker) {
            return;
        }

        const queryRunner = this.dataLayer.createQueryRunner();
        try {
            queryRunner.startTransaction();

            await queryRunner.manager.remove(marker.area);
            await queryRunner.manager.remove(marker);

            await queryRunner.commitTransaction();
            return;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    public async deleteProfile(profileId: number) {
        const profile = await this.dataLayer.mapProfileRepository.findProfileById(profileId, ["markers"]);
        if (!profile) {
            return;
        }

        let coordinatesPromises: Promise<CoordinatesDao[]>[] = [];
        if (profile.markers) {
            coordinatesPromises = profile.markers?.map((value) => this.dataLayer.coordinatesRepository.getCoordinatesByMarkerId(value.id));
        }
        const coordinates = (await Promise.all(coordinatesPromises))
            .reduce((previous, current) => {
                previous.push(...current);
                return previous;
            });

        const queryRunner = this.dataLayer.createQueryRunner();
        try {
            queryRunner.startTransaction();

            if (profile.markers) {
                await queryRunner.manager.remove(coordinates);
                await queryRunner.manager.remove(profile.markers);
            }
            await queryRunner.manager.remove(profile);
            await queryRunner.commitTransaction();
            return;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    public async getProfilesByUserId(userId: number) {
        return this.dataLayer.mapProfileRepository.getProfilesByUserId(userId, ["map", "markers"]);
    }

    private mapMarkerDtoToDao(marker: MarkerDto): MarkerDao {
        const newEntry = new MarkerDao();
        newEntry.name = marker.name;
        newEntry.description = marker.description ? marker.description : "";
        newEntry.xCoordinate = marker.position.x;
        newEntry.yCoordinate = marker.position.y;
        newEntry.areaColor = marker.color;

        newEntry.area = this.mapAreaCoordinatesDtoToDao(marker.bound);
        newEntry.area.forEach((value) => value.marker = newEntry);
        return newEntry;
    }

    private mapAreaCoordinatesDtoToDao(points: Point[]): CoordinatesDao[] {
        return points.map((value, index) => {
            const point = new CoordinatesDao();
            point.xCoordinate = value.x;
            point.yCoordinate = value.y;
            return point;
        });
    }
}
export {MapProfileService};

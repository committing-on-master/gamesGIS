import {OnlyObjectProperties} from "src/infrastructure/only.object.properties";
import {AbstractRepository, EntityRepository, FindOneOptions} from "typeorm";
import {MapProfileDao} from "../models/map.profile.dao";


// eslint-disable-next-line new-cap
@EntityRepository(MapProfileDao)
class MapProfileRepository extends AbstractRepository<MapProfileDao> {
    public async findProfileByName(profileName: string, relations?: OnlyObjectProperties<MapProfileDao>) {
        const options: FindOneOptions = {
            where: {name: profileName},
            ...((relations && relations.length !== 0) && {relations: relations}),
        };
        return this.repository.findOne(options);
    }

    public async createProfile(mapProfileDao: MapProfileDao) {
        return this.repository.insert(mapProfileDao);
    }

    public async isProfileExist(profileName: string): Promise<boolean> {
        return await this.repository.findOne({where: {name: profileName}}) ? true : false;
    }

    public async getAuthorIdByProfileName(profileName: string): Promise<number | undefined> {
        return this.repository.createQueryBuilder()
            .select("MapProfileDao.user.id")
            .where("MapProfileDao.name = :name", {name: profileName})
            .getRawOne<{ MapProfileDao_userId: number }>()
            .then((res) => res?.MapProfileDao_userId);
    }

    public async getAuthorIdByProfileId(profileId: number): Promise<number | undefined> {
        return this.repository.createQueryBuilder()
            .select("MapProfileDao.user.id")
            .where("MapProfileDao.id = :profileId", {name: profileId})
            .getRawOne<{ MapProfileDao_userId: number }>()
            .then((res) => res?.MapProfileDao_userId);
    }

    public async getProfilesByUserId(userId: number) {
        return this.repository.find({where: {user: {id: userId}}});
    }
}

export {MapProfileRepository};

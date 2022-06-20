import {nameofPropChecker} from "../../infrastructure/name.of.prop.checker";
import {AbstractRepository, EntityRepository} from "typeorm";
import {MapProfileStatisticsDao} from "../models/map.profile.statistics.dao";


// eslint-disable-next-line new-cap
@EntityRepository(MapProfileStatisticsDao)
class MapProfileStatisticsRepository extends AbstractRepository<MapProfileStatisticsDao> {
    public async getTopViewedMapProfiles(count: number = 5): Promise<MapProfileStatisticsDao[]> {
        return this.repository.createQueryBuilder()
            .select("MapProfileStatisticsDao")
            .orderBy("MapProfileStatisticsDao.viewsCount", "DESC")
            .limit(count)
            .innerJoinAndSelect("MapProfileStatisticsDao.profile", "profile", "profile.id = MapProfileStatisticsDao.profileId")
            .innerJoinAndSelect("profile.map", "map", "map.mapType = profile.mapMapType")
            .innerJoinAndSelect("profile.user", "user", "user.id = profile.userId")
            .getMany();
    }

    public async incrementViewsCount(profileId: number) {
        return this.repository.increment({profile: {id: profileId}}, nameofPropChecker<MapProfileStatisticsDao>("viewsCount"), 1);
    }
}

export {MapProfileStatisticsRepository};

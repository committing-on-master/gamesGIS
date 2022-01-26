import {AbstractRepository, EntityRepository} from "typeorm";
import {MarkerDao} from "../models/marker.dao";


// eslint-disable-next-line new-cap
@EntityRepository(MarkerDao)
class MarkerRepository extends AbstractRepository<MarkerDao> {
    public async getMarkersWithAreasByProfileName(profileName: string) {
        return this.repository.createQueryBuilder()
            .select("MarkerDao")
            .leftJoin("MarkerDao.profile", "profile")
            .where("profile.name = :name", {name: profileName})
            .leftJoinAndSelect("MarkerDao.area", "area")
            .where("area.marker.id = MarkerDao.id")
            .getMany();
    }

    saveMarker(newEntry: MarkerDao) {
        return this.repository.insert(newEntry);
    }

    getMarkersByProfileId(id: number): MarkerDao[] | PromiseLike<MarkerDao[]> {
        throw new Error("Method findMarkersByProfileId not implemented.");
    }
}

export {MarkerRepository};

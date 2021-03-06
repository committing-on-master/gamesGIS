import {OnlyObjectProperties} from "src/infrastructure/only.object.properties";
import {AbstractRepository, EntityRepository, FindOneOptions} from "typeorm";
import {MarkerDao} from "../models/marker.dao";


// eslint-disable-next-line new-cap
@EntityRepository(MarkerDao)
class MarkerRepository extends AbstractRepository<MarkerDao> {
    public async getMarkersWithAreasByProfileName(profileName: string) {
        return this.repository.createQueryBuilder()
            .select("MarkerDao")
            .innerJoin("MarkerDao.profile", "profile", "profile.name = :name", {name: profileName})
            .innerJoinAndSelect("MarkerDao.area", "area", "area.marker.id = MarkerDao.id")
            .getMany();
    }

    saveMarker(newEntry: MarkerDao) {
        return this.repository.insert(newEntry);
    }

    findMarkerById(markerId: number, relations?: OnlyObjectProperties<MarkerDao>) {
        const options: FindOneOptions = {
            where: {id: markerId},
            ...((relations && relations.length !==0 ) && {relations: relations}),
        };
        return this.repository.findOne(options);
    }
}

export {MarkerRepository};

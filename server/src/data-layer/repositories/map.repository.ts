import {AbstractRepository, EntityRepository} from "typeorm";
import {MapDao} from "../models/map.dao";


// eslint-disable-next-line new-cap
@EntityRepository(MapDao)
class MapRepository extends AbstractRepository<MapDao> {
    public async getMapByType(mapType: number) {
        return this.repository.findOne(mapType);
    }
}

export {MapRepository};

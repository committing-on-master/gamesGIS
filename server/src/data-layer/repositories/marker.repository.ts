import {AbstractRepository, EntityRepository} from "typeorm";
import {MarkerDao} from "../models/marker.dao";


// eslint-disable-next-line new-cap
@EntityRepository(MarkerDao)
class MarkerRepository extends AbstractRepository<MarkerDao> {
    saveMarker(newEntry: MarkerDao) {
        return this.repository.insert(newEntry);
    }

    findMarkersByProfileId(id: number): MarkerDao[] | PromiseLike<MarkerDao[]> {
        throw new Error("Method findMarkersByProfileId not implemented.");
    }
}

export {MarkerRepository};

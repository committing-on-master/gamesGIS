import {AbstractRepository, EntityRepository} from "typeorm";
import {CoordinatesDao} from "../models/coordinates.dao";


// eslint-disable-next-line new-cap
@EntityRepository(CoordinatesDao)
class CoordinatesRepository extends AbstractRepository<CoordinatesDao> {
    public async getCoordinatesByMarkerId(markerId: number) {
        return this.repository.find({where: {marker: {id: markerId}}});
    }
    public async saveCoordinates(area: CoordinatesDao[]) {
        return this.repository.insert(area);
    }
}

export {CoordinatesRepository};

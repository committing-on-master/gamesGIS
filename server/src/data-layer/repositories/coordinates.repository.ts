import {AbstractRepository, EntityRepository} from "typeorm";
import {CoordinatesDao} from "../models/coordinates.dao";


// eslint-disable-next-line new-cap
@EntityRepository(CoordinatesDao)
class CoordinatesRepository extends AbstractRepository<CoordinatesDao> {
}

export {CoordinatesRepository};

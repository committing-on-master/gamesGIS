import {AbstractRepository, EntityRepository} from "typeorm";
import {GalleryDao} from "../models/gallery.dao";


// eslint-disable-next-line new-cap
@EntityRepository(GalleryDao)
class GalleryRepository extends AbstractRepository<GalleryDao> {
}

export {GalleryRepository};

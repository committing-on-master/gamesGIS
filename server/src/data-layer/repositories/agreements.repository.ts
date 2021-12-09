import {AbstractRepository, EntityRepository} from "typeorm";
import {AgreementsDAO} from "../models/agreements.dao";

// eslint-disable-next-line new-cap
@EntityRepository(AgreementsDAO)
class AgreementsRepository extends AbstractRepository<AgreementsDAO> {
    public async getLastAgreement() {
        return await this.repository.findOne({order: {version: "DESC"}});
    }
}

export {AgreementsRepository};

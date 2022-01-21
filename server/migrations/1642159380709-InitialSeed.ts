import {UsersDAO} from "./../src/data-layer/models/users.dao";
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {userAdmin} from "./InitialData/Users";
import {MapDao} from "./../src/data-layer/models/map.dao";
import {maps} from "./InitialData/Maps";
import {mapProfile} from "./InitialData/MapProfile";
import {MapProfileDao} from "./../src/data-layer/models/map.profile.dao";
import {AgreementsDAO} from "./../src/data-layer/models/agreements.dao";
import {agreement} from "./InitialData/Agreement";


export class InitialSeed1642159380709 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(AgreementsDAO, "develop").save(agreement);
        await getRepository(UsersDAO, "develop").save(userAdmin);
        await getRepository(MapDao, "develop").save(maps);
        mapProfile.map = maps[0];
        mapProfile.user = userAdmin;
        await getRepository(MapProfileDao, "develop").save(mapProfile);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}

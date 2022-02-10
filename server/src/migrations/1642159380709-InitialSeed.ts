import {UsersDAO} from "../data-layer/models/users.dao";
import {getRepository, MigrationInterface, QueryRunner} from "typeorm";
import {userAdmin} from "./initial-data/users";
import {MapDao} from "../data-layer/models/map.dao";
import {maps} from "./initial-data/maps";
import {mapProfile} from "./initial-data/map.profile";
import {MapProfileDao} from "../data-layer/models/map.profile.dao";
import {AgreementsDAO} from "../data-layer/models/agreements.dao";
import {agreement} from "./initial-data/agreement";
import {MarkerDao} from "../data-layer/models/marker.dao";
import {markers} from "./initial-data/markers";
import {areas} from "./initial-data/area.coordinates";
import {CoordinatesDao} from "../data-layer/models/coordinates.dao";


export class InitialSeed1642159380709 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository(AgreementsDAO, "develop").save(agreement);
        const savedUser = await getRepository(UsersDAO, "develop").save(userAdmin);
        const savedMaps = await getRepository(MapDao, "develop").save(maps);
        mapProfile.map = savedMaps[0];
        mapProfile.user = savedUser;
        const savedProfile = await getRepository(MapProfileDao, "develop").save(mapProfile);

        let firstMarker = markers[0];
        firstMarker.profile = savedProfile;
        firstMarker = await getRepository(MarkerDao, "develop").save(firstMarker);
        const firstArea = areas[0];
        firstArea.forEach((value) => value.marker = firstMarker);
        await getRepository(CoordinatesDao, "develop").save(firstArea);

        let secondMarker = markers[1];
        secondMarker.profile = savedProfile;
        secondMarker = await getRepository(MarkerDao, "develop").save(secondMarker);
        const secondArea = areas[1];
        secondArea.forEach((value) => value.marker = secondMarker);
        await getRepository(CoordinatesDao, "develop").save(secondArea);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}

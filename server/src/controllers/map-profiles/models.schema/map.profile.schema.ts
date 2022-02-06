import {StaticSchemaFactory} from "./../../../controllers/common-types/schema.factory";
import {SchemaValidationProps} from "./../../../controllers/common-types/schema.validation.type";
import {MapProfileDto} from "../../../dto/request/map.profile.dto";

const MapProfileDtoSchema: SchemaValidationProps<MapProfileDto> = {
    profileName: StaticSchemaFactory.createProfileNameSchema(),
    map: StaticSchemaFactory.createMapSchema(),
};

export {MapProfileDtoSchema};

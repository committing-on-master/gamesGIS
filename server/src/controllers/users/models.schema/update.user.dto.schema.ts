import { StaticSchemaFactory } from "./../../common-types/schema.factory";
import { SchemaValidationProps } from "../../../controllers/common-types/schema.validation.type";
import { PatchUserDto } from "../../../services-layer/users/models/patch.user.dto";

const patchUserDtoSchema: SchemaValidationProps<PatchUserDto> = {
    email: StaticSchemaFactory.createEmailSchema(true),
    password: StaticSchemaFactory.createPasswordSchema(true),
    name: StaticSchemaFactory.createNameSchema(true)
}

export { patchUserDtoSchema }
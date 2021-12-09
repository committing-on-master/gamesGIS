import {SchemaValidationProps} from "../../common-types/schema.validation.type";
import {CreateUserDto} from "../../../services-layer/users/models/create.user.dto";
import {StaticSchemaFactory} from "./../..//common-types/schema.factory";

const createUserDtoSchema: SchemaValidationProps<CreateUserDto> = {
    email: StaticSchemaFactory.createEmailSchema(),
    password: StaticSchemaFactory.createPasswordSchema(),
    name: StaticSchemaFactory.createNameSchema(),
};

export {createUserDtoSchema};

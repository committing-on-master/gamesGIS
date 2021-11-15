import { SchemaValidationProps } from "./../../common-types/schema.validation.type";
import { StaticSchemaFactory } from "./../../common-types/schema.factory";

interface LoginAuthBody {
    email: string,
    password: string,
}

const LoginAuthSchema: SchemaValidationProps<LoginAuthBody> = {
    email: StaticSchemaFactory.createEmailSchema(),
    password: StaticSchemaFactory.createPasswordSchema()
}

export { LoginAuthSchema }
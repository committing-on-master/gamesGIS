import {SchemaValidationProps} from "./../../common-types/schema.validation.type";
import {StaticSchemaFactory} from "./../../common-types/schema.factory";

interface RefreshAuthBody {
    id: number,
    refreshToken: string,
}

const RefreshAuthSchema: SchemaValidationProps<RefreshAuthBody> = {
    id: StaticSchemaFactory.createIdSchema(),
    refreshToken: StaticSchemaFactory.createRefreshTokenSchema(),
};

export {RefreshAuthSchema};

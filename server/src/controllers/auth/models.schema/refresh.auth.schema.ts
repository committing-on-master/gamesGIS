import {SchemaValidationProps} from "./../../common-types/schema.validation.type";
import {StaticSchemaFactory} from "./../../common-types/schema.factory";

interface RefreshAuthBody {
    refreshToken: string,
}

const RefreshAuthSchema: SchemaValidationProps<RefreshAuthBody> = {
    refreshToken: StaticSchemaFactory.createRefreshTokenSchema(),
};

export {RefreshAuthSchema};

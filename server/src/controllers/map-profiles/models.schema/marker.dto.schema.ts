import {StaticSchemaFactory} from "./../../common-types/schema.factory";

/* eslint-disable quote-props */
const markerDtoSchema = {
    id: StaticSchemaFactory.createIdSchema(true),
    name: StaticSchemaFactory.createMarkerNameSchema(),
    description: StaticSchemaFactory.createMarkerDescriptionSchema(256),
    color: StaticSchemaFactory.createColorSchema(),

    "position.x": StaticSchemaFactory.createNumericSchema(),
    "position.y": StaticSchemaFactory.createNumericSchema(),

    "bound.*.x": StaticSchemaFactory.createNumericSchema(),
    "bound.*.y": StaticSchemaFactory.createNumericSchema(),
};
export {markerDtoSchema};

import { Point } from "../../api/dto/types/Point";

export enum MarkerState {
    Undefined = 0,
    New = 1,
    Editable = 2,
    Saved = 4
}

export type MarkerType = {
    id: number,
    name: string,
    description: string,
    state: MarkerState,
    position?: Point,
    color: string;
    bound: Point[] //import { LatLngExpression } from "leaflet";
}
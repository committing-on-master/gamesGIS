import { Point } from "../../api/dto/types/Point";

export enum MarkerState {
    Undefined = 0,
    New = 1,
    Editable = 2
}

export type EditingMarkerType = Partial<MarkerType> & {
    state: MarkerState
}

export type MarkerType = {
    id: number,
    name: string,
    description: string,
    position: Point,
    color: string;
    bound: Point[] //import { LatLngExpression } from "leaflet";
}
import { Point } from "../../api/dto/types/Point";

export enum EditingState {
    Undefined = 0,
    New = 1,
    Editable = 2
}

export type EditingMarkerType = Partial<MarkerType> & {
    state: EditingState;
    color: string;
}

export type MarkerType = {
    id: number,
    name: string,
    description: string,
    position: Point,
    color: string;
    bound: Point[];
}
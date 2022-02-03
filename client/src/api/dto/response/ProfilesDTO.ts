import { SuccessResponse } from "../SuccessResponse";
import { MapType } from "../types/MapType";

export type MapProfileType = {
    id: number;
    name: string;
    map: MapType;
    creationDate: Date;
    markersCount: number;
}

export interface ProfilesDTO extends SuccessResponse<MapProfileType[]> { };
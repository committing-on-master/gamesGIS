import { SuccessResponse } from "../SuccessResponse";
import { MapType } from "../types/MapType";

export type MapProfileReviewType = {
    id: number;
    name: string;
    map: MapType;
    creationDate: Date;
    markersCount: number;
}

export interface MapProfilesReviewDTO extends SuccessResponse<MapProfileReviewType[]> { };
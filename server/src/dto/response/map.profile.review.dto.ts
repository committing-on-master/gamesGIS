import {MapType} from "src/services-layer/map-profile/models/map.type";

export interface MapProfileReviewDTO {
    id: number;
    name: string;
    map: MapType;
    creationDate: Date;
    markersCount: number;
};

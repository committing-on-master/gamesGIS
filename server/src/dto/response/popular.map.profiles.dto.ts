import {MapType} from "../../services-layer/map-profile/models/map.type";

export interface ProfileInfo {
    name: string;
    author: string;
    type: MapType;
    views: number;
};

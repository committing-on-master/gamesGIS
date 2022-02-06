import {MapType} from "../../services-layer/map-profile/models/map.type";

export interface MapProfileDto {
    profileName: string;
    map: MapType;
}

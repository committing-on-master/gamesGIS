import { SuccessResponse } from "../SuccessResponse";
import { MapType } from "../types/MapType";

export interface ProfileInfo {
    name: string;
    author: string;
    type: MapType;
    views: number;
}

export interface PopularMapProfilesDTO extends SuccessResponse<ProfileInfo[]> {};
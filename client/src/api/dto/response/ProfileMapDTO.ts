import { SuccessResponse } from "../SuccessResponse";
import { MapBound } from "../types/MapBound";
import { MapType } from "../types/MapType";
import { Point } from "../types/Point";

export interface MapAreas {
    id: number;
    name: string;
    center: Point;
    color: string;
    aria: Point[];
}

interface Payload {
    id: number;
    name: string;
    
    mapType: MapType;
    center: Point;
    bound: MapBound;
    points: MapAreas[];
}

export interface ProfileMapDTO extends SuccessResponse<Payload> {}

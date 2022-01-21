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
    userId: number;
    name: string;
    
    mapType: MapType;
    center: Point;
    bound: MapBound;
    maxLayers: number;
    currentLayer: number;

    minZoom: number,
    maxZoom: number,
}

export interface ProfileMapDTO extends SuccessResponse<Payload> {}

import {MapType} from "../../services-layer/map-profile/models/map.type";

export type Point = {
    x: number,
    y: number
}

export type MapBound = [Point, Point];

class Profile {
    id!: number;
    userId!: number;
    name!: string;
    mapType!: MapType;
    center!: Point;
    bound!: MapBound;
    maxLayers!: number;
    currentLayer!: number;
    minZoom!: number;
    maxZoom!: number;
}

// export interface MapAreas {
//     id: number;
//     name: string;
//     center: Point;
//     color: string;
//     aria: Point[];
// }

export {Profile};

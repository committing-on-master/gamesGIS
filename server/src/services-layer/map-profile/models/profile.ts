import {MapType} from "./map.type";

export type Point = {
    x: number,
    y: number
}

export type MapBound = [Point, Point];

class Profile {
    id!: number;
    name!: string;
    mapType!: MapType;
    center!: Point;
    bound!: MapBound;
    // points?: MapAreas[];
}

// export interface MapAreas {
//     id: number;
//     name: string;
//     center: Point;
//     color: string;
//     aria: Point[];
// }

export {Profile};

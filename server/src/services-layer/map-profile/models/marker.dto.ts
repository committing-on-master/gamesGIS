import {Point} from "./profile";

export interface MarkerDto {
    id?: number;
    name: string;
    description?: string;
    position: Point;
    color: string;
    bound: Point[];
}

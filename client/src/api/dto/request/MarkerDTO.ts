import { Point } from "../types/Point";

export interface MarkerDTO {
    id?: number;
    name: string;
    description: string;
    position: Point;
    color: string;
    bound: Point[];
}
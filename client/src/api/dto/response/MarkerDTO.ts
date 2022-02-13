import { SuccessResponse } from "../SuccessResponse";
import { Point } from "../types/Point";

interface Payload {
    id: number;
    name: string;
    description: string;
    position: Point;
    color: string;
    bound: Point[];
}

export interface MarkerDTO extends SuccessResponse<Payload> {};

export interface MarkersDTO extends SuccessResponse<Payload[]> {};

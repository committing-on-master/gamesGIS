import { MapType } from "../../api/dto/types/MapType";
import { Point } from "../../api/dto/types/Point";

interface MapState {
    map: MapType;
    maxLayers: number;
    center?: Point;
    bounds?: [Point, Point];

    spotlightAreaId?: number;
}

const initialState: MapState = {
    map: MapType.Undefined,
    maxLayers: 0
}

const name = (state: MapState) => state.map;
const bounds = (state: MapState) => state.bounds;
const center = (state: MapState) => state.center;
const spotlightAreaId = (state: MapState) => state.spotlightAreaId;

const mapSelectors = {
    name,
    bounds,
    center,
    spotlightAreaId
}

export { initialState, mapSelectors }

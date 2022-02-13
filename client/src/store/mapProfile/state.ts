import { createSelector } from "@reduxjs/toolkit";
import { MapType } from "../../api/dto/types/MapType";
import { Point } from "../../api/dto/types/Point";

interface MapProfileState {
    id: number;
    authorId: number;
    name: string;

    map: MapType;
    center: Point;
    bounds: [Point, Point];
    
    minZoom: number;
    maxZoom: number;

    maxLayers: number;
    currentLayer: number;
}

const initialState = {} as MapProfileState;

const currentLayer = (state: MapProfileState) => state.currentLayer;

const containerParams = createSelector(
    (state: MapProfileState) => state.authorId,
    (state: MapProfileState) => state.name,

    (state: MapProfileState) => state.map,
    (state: MapProfileState) => state.center,
    (state: MapProfileState) => state.bounds,
    (state: MapProfileState) => state.maxLayers,

    (state: MapProfileState) => state.minZoom,
    (state: MapProfileState) => state.maxZoom,

    (authorId, name, map, center, bounds, maxLayers, minZoom, maxZoom) => {
        return {
            authorId: authorId,
            name: name,

            center: center,

            zoom: {
                min: minZoom,
                max: maxZoom
            }
        }
    }
)

const layerParams = createSelector(
    (state: MapProfileState) => state.map,
    (state: MapProfileState) => state.bounds,
    (map, bounds) => {
        return {
            map: map,
            bounds: bounds
        }
    }
);
const mapSelectors = {
    currentLayer,
    layerParams,
    containerParams,
}

export { initialState, mapSelectors }

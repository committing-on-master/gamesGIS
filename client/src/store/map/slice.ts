import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MapBound } from "../../api/dto/types/MapBound";
import { MapType } from "../../api/dto/types/MapType";
import { Point } from "../../api/dto/types/Point";
import { initialState } from "./state";


export type setMapActionType = {
    map: MapType,
    maxLayers: number;
    center?: Point;
    bounds?: MapBound;
}

const mapSlice = createSlice({
    name: "map",
    initialState,
    reducers: {
        setMap: {
            reducer: (state, action: PayloadAction<setMapActionType>) => {
                state.map = action.payload.map;
                state.bounds = action.payload.bounds;
                state.center = action.payload.center;
                state.maxLayers = action.payload.maxLayers;
            },
            prepare: (map: MapType, center: Point, bounds: MapBound) => {
                return {
                    payload: {
                        map: map,
                        maxLayers: 0,
                        bounds: bounds,
                        center: center
                    }
                }
            }
        },
        setSpotlightArea: (state, action: PayloadAction<number>) => {
            if (!state.spotlightAreaId) {
                state.spotlightAreaId = action.payload;
            }
        },
        removeSpotlightArea: (state, action: PayloadAction<number>) => {
            if (action.payload === state.spotlightAreaId) {
                state.spotlightAreaId = undefined;
            }
        }
    }
});

export const mapReducer = mapSlice.reducer;

export const { setMap, setSpotlightArea, removeSpotlightArea } = mapSlice.actions

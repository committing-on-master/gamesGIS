import { createEntityAdapter, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../api/dto/types/Point";
import { MarkerState, MarkerType } from "./types";

const markersAdapter = createEntityAdapter<MarkerType>({
    selectId: (area) => area.id,
    sortComparer: (a, b) => {
        if (!a.position) {
            return -1;
        }
        if (!b.position) {
            return 1;
        }
        const yDelta = a.position.y - b.position.y;
        if (yDelta !== 0) {
            return yDelta;
        }
        return a.position.x - b.position.x;
    } 
});

const markersSlice = createSlice({
    name: 'markers',
    initialState: markersAdapter.getInitialState(),
    reducers: {
        addMarker: markersAdapter.addOne,
        addMarkers: markersAdapter.addMany,
        insertOrReplaceMarker: markersAdapter.setOne,
        updateMarker: markersAdapter.updateOne,
        createMarker: (state, action: PayloadAction<string>) => {
            const marker: MarkerType = {
                id: -1,
                state: MarkerState.Editable,
                name: action.payload,
                color: "e66465", // pink
                description: "",
                bound: [] as Point[]
            }
            markersAdapter.addOne(state, marker);
            // addMarker(marker);
        }
    }
});

export const {
    selectById: selectMarkerById,
    selectAll: selectAllMarkers,
} = markersAdapter.getSelectors();

export const selectEditableMarker = (state: EntityState<MarkerType>) => {
    const entities = selectAllMarkers(state);
    return entities.find((value) => value.state === MarkerState.Editable);
}

// оче плохое название, оче плохая организация
export const selectIsEdit = (state: EntityState<MarkerType>) => {
    return selectEditableMarker(state) ? true : false;
}

export const markersReducer = markersSlice.reducer;

export const { addMarker, addMarkers, updateMarker, createMarker } = markersSlice.actions;

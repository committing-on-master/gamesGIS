import { createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../api/dto/types/Point";
import { fetchProfileMarkers, saveEditingMarker } from "./thunks";

import { EditingMarkerType, EditingState, MarkerType } from "./types";

export interface MarkersState {
    editable: EditingMarkerType;
    saved: EntityState<MarkerType>;
}

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

const initialState: MarkersState = {
    editable: { state: EditingState.Undefined, color: "#0409ff" },
    saved: markersAdapter.getInitialState(),
}

const markersSlice = createSlice({
    name: 'markers',
    initialState: initialState,
    reducers: {
        createNewMarker: (state: MarkersState, action: PayloadAction<string>) => {
            state.editable = {...initialState.editable};
            state.editable.state = EditingState.New;
            state.editable.name = action.payload;
        },
        editSavedMarker: (state, action: PayloadAction<number>) => {
            const marker = selectMarkerById(state, action.payload);
            if (!marker) {
                return;
            }
            state.editable = {...marker, state: EditingState.Saved};
        },
        updateMarkerPosition: (state: MarkersState, action: PayloadAction<Point>) => {
            state.editable.position = action.payload;
        },
        addAreaCoordinates: (state: MarkersState, action: PayloadAction<Point>) => {
            if (state.editable.bound) {
                state.editable.bound.push(action.payload);
            } else {
                state.editable.bound = [action.payload];
            }
        },
        setAreaColor: (state: MarkersState, action: PayloadAction<string>) => {
            state.editable.color = action.payload;
        },
        setMarkerDescription: (state: MarkersState, action: PayloadAction<string>) =>{
            state.editable.description = action.payload;
        },
        resetMarker: (state: MarkersState) => {
            state.editable = {...initialState.editable};
        },

        addMarker: (state: MarkersState, action: PayloadAction<MarkerType>) => {
            markersAdapter.addOne(state.saved, action);
        },
        addMarkers: (state: MarkersState, action: PayloadAction<MarkerType[]>) => {
            markersAdapter.addMany(state.saved, action);
        },
        removeMarker: (state: MarkersState, action: PayloadAction<number>) => {
            markersAdapter.removeOne(state.saved, action.payload);
        }
    },
    extraReducers: (builder) => { builder
        .addCase(saveEditingMarker.fulfilled, (state, action: PayloadAction<MarkerType>) => {
            markersAdapter.setOne(state.saved, action.payload);
            state.editable = {...initialState.editable};
        })

        .addCase(fetchProfileMarkers.fulfilled, (state, action: PayloadAction<MarkerType[]>) => {
            state.editable = {...initialState.editable};
            markersAdapter.setAll(state.saved, action.payload)
        })
    }
});

export const selectMarkerById = (state: MarkersState, id: number) => markersAdapter.getSelectors().selectById(state.saved, id);
export const selectAllMarkers = (state: MarkersState) => markersAdapter.getSelectors().selectAll(state.saved);

export const selectEditableMarker = (state: MarkersState) => {
    if (state.editable.state === EditingState.Undefined) {
        return undefined;
    }
    return state.editable;
}

export const selectEditableCoordinates = (state: MarkersState) => {
    return state.editable.bound;
}

export const selectEditableColor = (state: MarkersState) => {
    return state.editable.color;
}

// TODO test
export const selectEditingMarkerIconParams = createSelector(
    (state: MarkersState) => state.editable.name,
    (state: MarkersState) => state.editable.position,
    (name, position) => {
        if (name && position) {
            return {
                name: name,
                position: position
            }
        }
        return undefined;
    }
);

export const selectEditingMarker = (state: MarkersState) => state.editable;

// оче плохое название, оче плохая организация
export const selectIsEditingMode = (state: MarkersState) => {
    return state.editable.state !== EditingState.Undefined;
}

export const markersReducer = markersSlice.reducer;

export const { 
    addMarker,
    addMarkers,
    createNewMarker,
    updateMarkerPosition,
    addAreaCoordinates,
    setAreaColor,
    editSavedMarker
} = markersSlice.actions;

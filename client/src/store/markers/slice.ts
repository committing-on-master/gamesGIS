import { createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../api/dto/types/Point";

import { EditingMarkerType, MarkerState, MarkerType } from "./types";

interface MarkersState {
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
    editable: { state: MarkerState.Undefined },
    saved: markersAdapter.getInitialState(),
}

const markersSlice = createSlice({
    name: 'markers',
    initialState: initialState,
    reducers: {
        createNewMarker: (state: MarkersState, action: PayloadAction<string>) => {
            state.editable.state = MarkerState.New;
            state.editable.name = action.payload;
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

        addMarker: (state, action: PayloadAction<MarkerType>) => {
            markersAdapter.addOne(state.saved, action)
        },
        addMarkers: (state, action: PayloadAction<MarkerType[]>) => {
            markersAdapter.addMany(state.saved, action)
        },
    }
});

export const selectMarkerById = (state: MarkersState, id: number) => markersAdapter.getSelectors().selectById(state.saved, id);
export const selectAllMarkers = (state: MarkersState) => markersAdapter.getSelectors().selectAll(state.saved);

export const selectEditableMarker = (state: MarkersState) => {
    if (state.editable.state === MarkerState.Undefined) {
        return undefined;
    }
    return state.editable;
}

export const selectEditableCoordinates = (state: MarkersState) => {
    return state.editable.bound;
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


// оче плохое название, оче плохая организация
export const selectIsEditingMode = (state: MarkersState) => {
    return state.editable.state !== MarkerState.Undefined;
}

export const markersReducer = markersSlice.reducer;

export const { addMarker, addMarkers, createNewMarker, updateMarkerPosition, addAreaCoordinates, setAreaColor } = markersSlice.actions;

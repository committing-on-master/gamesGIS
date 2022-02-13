import { createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { Point } from "../../api/dto/types/Point";
import { deleteProfileMarker, fetchProfileMarkers, saveEditingMarker } from "./thunks";

import { EditingMarkerType, EditingState, MarkerType, SpotlightStatus, SpotlightType } from "./types";

export interface MarkersState {
    editable: EditingMarkerType;
    saved: EntityState<MarkerType>;
    spotlight: SpotlightType;
}

const markersAdapter = createEntityAdapter<MarkerType>({
    selectId: (area) => area.id,
    sortComparer: (a, b) => {
        if (!a.position) {
            return 1;
        }
        if (!b.position) {
            return -1;
        }
        const yDelta = b.position.x - a.position.x;
        if (yDelta !== 0) {
            return yDelta;
        }
        return b.position.y - a.position.y;
    }
});

const initialState: MarkersState = {
    editable: {
        state: EditingState.Undefined, color: "#0409ff"
    },
    saved: markersAdapter.getInitialState(),
    spotlight: {
        markerId: undefined,
        state: SpotlightStatus.Undefined
    }
}

const markersSlice = createSlice({
    name: 'markers',
    initialState: initialState,
    reducers: {
        resetMarkers: (state) => {
            markersAdapter.removeAll(state.saved);
            state.editable = {...initialState.editable};
            state.saved = {...initialState.saved};
            state.spotlight = {...initialState.spotlight};
        },
        createNewMarker: (state: MarkersState, action: PayloadAction<string>) => {
            state.editable = { ...initialState.editable };
            state.editable.state = EditingState.New;
            state.editable.name = action.payload;
        },
        editSavedMarker: (state, action: PayloadAction<number>) => {
            const marker = selectMarkerById(state.saved, action.payload);
            if (!marker) {
                return;
            }
            state.editable = { ...marker, state: EditingState.Saved };
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
        removeAreaCoordinates: (state: MarkersState) => {
            state.editable.bound = [];
        },
        setAreaColor: (state: MarkersState, action: PayloadAction<string>) => {
            state.editable.color = action.payload;
        },
        setMarkerDescription: (state: MarkersState, action: PayloadAction<string>) => {
            state.editable.description = action.payload;
        },
        cancelEditionMode: (state: MarkersState) => {
            state.editable = { ...initialState.editable };
            state.spotlight = { ...initialState.spotlight };
        },

        turnOnSpotlightHover: (state: MarkersState, action: PayloadAction<number>) => {
            if (state.spotlight.state !== SpotlightStatus.Selected) {
                state.spotlight.state = SpotlightStatus.Hovered;
                state.spotlight.markerId = action.payload;
            }
        },
        turnOffSpotlightBlur: (state: MarkersState) => {
            if (state.spotlight.state !== SpotlightStatus.Selected) {
                state.spotlight = { ...initialState.spotlight };
            }
        },
        turnOnSpotlightSelect: (state: MarkersState, action: PayloadAction<number>) => {
            state.spotlight.state = SpotlightStatus.Selected;
            state.spotlight.markerId = action.payload;
        },
        turnOffSpotlightClose: (state: MarkersState) => {
            state.spotlight = { ...initialState.spotlight };
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
    extraReducers: (builder) => {
        builder
            .addCase(saveEditingMarker.fulfilled, (state, action: PayloadAction<MarkerType>) => {
                markersAdapter.setOne(state.saved, action.payload);
                state.editable = { ...initialState.editable };
            })

            .addCase(fetchProfileMarkers.fulfilled, (state, action: PayloadAction<MarkerType[]>) => {
                state.editable = { ...initialState.editable };
                markersAdapter.setAll(state.saved, action.payload)
            })

            .addCase(deleteProfileMarker.fulfilled, (state, action: PayloadAction<number>) => {
                state.editable = {...initialState.editable };
                markersAdapter.removeOne(state.saved, action.payload);
            })
    }
});

export const selectSpotlightArea = (state: MarkersState) => {
    if (state.spotlight.markerId) {
        const marker = selectMarkerById(state.saved, state.spotlight.markerId);
        if (marker) {
            return {
                coordinates: marker.bound,
                color: marker.color
            };
        }
    }
    return undefined;
}

export const { selectById: selectMarkerById, selectAll: selectAllMarkers } = markersAdapter.getSelectors();

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
    editSavedMarker,
    cancelEditionMode,
    turnOnSpotlightHover,
    turnOffSpotlightBlur,
    turnOnSpotlightSelect,
    turnOffSpotlightClose,
    resetMarkers,
    removeAreaCoordinates
} = markersSlice.actions;

import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { LatLngExpression } from "leaflet";
import { Point } from "../../api/dto/types/Point";

export type AreaType = {
    id: number,
    name: string,
    description: string,
    position: Point,
    color: string;
    bound: LatLngExpression[]
}

const areasAdapter = createEntityAdapter<AreaType>({
    selectId: (area) => area.id,
    sortComparer: (a, b) => {
        const yDelta = a.position.y - b.position.y;
        if (yDelta !== 0) {
            return yDelta;
        }
        return a.position.x - b.position.x;
    } 
})

const areasSlice = createSlice({
    name: 'arias',
    initialState: areasAdapter.getInitialState(),
    reducers: {
        // Can pass adapter functions directly as case reducers.  Because we're passing this
        // as a value, `createSlice` will auto-generate the `bookAdded` action type / creator
        addArea: areasAdapter.addOne,
        addAreas: areasAdapter.addMany,
        updateArea: areasAdapter.updateOne
    }
});


export const {
    selectById: selectAreaById,
    selectAll: selectAllAreas
} = areasAdapter.getSelectors();

export const areasReducer = areasSlice.reducer;

export const { updateArea, addArea, addAreas } = areasSlice.actions;

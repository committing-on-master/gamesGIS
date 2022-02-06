import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorDTO } from "../../api/dto/response/ErrorDTO";
import { MarkerDTO, MarkersDTO } from "../../api/dto/response/MarkerDTO";
import { Result } from "../../api/iResult ";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { RootState } from "../store";
import { resetMarkers } from "./slice";
import { EditingState, MarkerType } from "./types";

type ThunkArg = {
    name: string;
    description: string;
}

export const saveEditingMarker = createAsyncThunk<MarkerType, ThunkArg, {state: RootState}>(
    "markers/saving",
    async (thunkArg, thunkApi) => {
        const marker = {...thunkApi.getState().markers.editable};
        marker.name = thunkArg.name;
        marker.description = thunkArg.description;
        const profileName = thunkApi.getState().map.name;
        
        let response: Result<MarkerDTO, ErrorDTO>;
        if (marker.state === EditingState.New) {
            response = await RequestWrapper.endPoint(`map-profiles/${profileName}/markers`).withAuth().post(marker).send<MarkerDTO, ErrorDTO>();
        } else {
            response = await RequestWrapper.endPoint(`map-profiles/${profileName}/markers/${marker.id}`).withAuth().put(marker).send<MarkerDTO, ErrorDTO>();
        }
        
        if (response.ok && response.success) {
            const payload: MarkerType = response.success.payload
            return payload;
        }
        throw new Error(response.failure?.message);
    }
);

export const fetchProfileMarkers = createAsyncThunk(
    "markers/fetching",
    async (profileName: string, thunkApi) => {
        thunkApi.dispatch(resetMarkers());
        const response = await RequestWrapper.endPoint(`map-profiles/${profileName}/markers`).get().send<MarkersDTO, ErrorDTO>();
        if (response.ok && response.success) {
            const payload: MarkerType[] = response.success.payload
            return payload;
        }
        throw new Error(response.failure?.message);
    }
);

export const deleteProfileMarker = createAsyncThunk<number, number, {state: RootState}> (
    "markers/deleting",
    async (markerId: number, thunkApi) => {
        const profileName = thunkApi.getState().map.name;
        const response = await RequestWrapper.endPoint(`map-profiles/${profileName}/markers/${markerId}`).withAuth().delete().send<{}, ErrorDTO>();
        if (response.ok) {
            return markerId;
        }
        throw new Error(response.failure?.message);
    }
)

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorDTO } from "../../api/dto/response/ErrorDTO";
import { MarkerDTO, MarkersDTO } from "../../api/dto/response/MarkerDTO";
import { Result } from "../../api/iResult ";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { RootState } from "../store";
import { EditingState, MarkerType } from "./types";

export const saveMarker = createAsyncThunk<MarkerType, string, {state: RootState}>(
    "markers/saving",
    async (profileName: string, thunkApi) => {
        const marker = thunkApi.getState().markers.editable;
        
        let response: Result<MarkerDTO, ErrorDTO>;
        if (marker.state === EditingState.New) {
            response = await RequestWrapper.endPoint(`map-profile/${profileName}/markers`).withAuth().post(marker).send<MarkerDTO, ErrorDTO>();
        } else {
            response = await RequestWrapper.endPoint(`map-profile/${profileName}/markers/${marker.id}`).withAuth().put(marker).send<MarkerDTO, ErrorDTO>();
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
        const response = await RequestWrapper.endPoint(`map-profile/${profileName}/markers`).get().send<MarkersDTO, ErrorDTO>();
        if (response.ok && response.success) {
            const payload: MarkerType[] = response.success.payload
            return payload;
        }
        throw new Error(response.failure?.message);
    }
);

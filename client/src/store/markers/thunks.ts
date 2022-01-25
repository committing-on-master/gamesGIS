import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorDTO } from "../../api/dto/response/ErrorDTO";
import { MarkerDTO as resDTO } from "../../api/dto/response/MarkerDTO";
import { Result } from "../../api/iResult ";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { RootState } from "../store";
import { MarkersState } from "./slice";
import { EditingState, MarkerType } from "./types";

export const saveMarker = createAsyncThunk<MarkerType, string, {state: RootState}>(
    "MarkerType/saving",
    async (profileName: string, thunkApi) => {
        const marker = thunkApi.getState().markers.editable;
        
        let response: Result<resDTO, ErrorDTO>;
        if (marker.state === EditingState.New) {
            response = await RequestWrapper.endPoint(`map-profile/${profileName}/markers`).withAuth().post(marker).send<resDTO, ErrorDTO>();
        } else {
            response = await RequestWrapper.endPoint(`map-profile/${profileName}/markers/${marker.id}`).withAuth().put(marker).send<resDTO, ErrorDTO>();
        }
        
        if (response.ok && response.success) {
            const payload: MarkerType = response.success.payload
            return payload;
        }
        throw new Error(response.failure?.message);
    }
);

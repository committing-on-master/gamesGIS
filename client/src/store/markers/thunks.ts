import { createAsyncThunk, EntityState } from "@reduxjs/toolkit";
import { MarkerDTO as reqDTO} from "../../api/dto/request/MarkerDTO";
import { ErrorDTO } from "../../api/dto/response/ErrorDTO";
import { MarkerDTO as resDTO } from "../../api/dto/response/MarkerDTO";
import { Result } from "../../api/iResult ";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { selectMarkerById } from "./slice";
import { MarkerState, MarkerType } from "./types";

export const saveMarker = createAsyncThunk<MarkerType, number, {state: EntityState<MarkerType>}>(
    "MarkerType/saving",
    async (id: number, thunkApi) => {
        const marker = selectMarkerById(thunkApi.getState(), id);
        if (!marker) {
            throw new Error(`marker with id: ${id} not found in store`);
        }
        if ((marker.state & (MarkerState.New | MarkerState.Editable)) === 0) {
            throw new Error(`marker with id: ${id} already synced`);
        }
        if (!marker.position) {
            throw new Error("marker position is not determined");
        }

        const reqBody: reqDTO = {
            name: marker.name,
            description: marker.description,
            color: marker.color,
            bound: marker.bound,
            position: marker.position,
        }

        let response: Result<resDTO, ErrorDTO>;

        if (id < 0) {
            response = await RequestWrapper.endPoint("/map-profile/:profileName/markers").withAuth().post(reqBody).send<resDTO, ErrorDTO>();
        } else {
            response = await RequestWrapper.endPoint(`/map-profile/:profileName/markers/${id}`).withAuth().put(reqBody).send<resDTO, ErrorDTO>();
        }

        if (response.ok && response.success) {
            const responseBody = response.success.payload;
            const payload: MarkerType = {
                id: responseBody.id,
                name: responseBody.name,
                description: responseBody.description,
                bound: responseBody.bound,
                color: responseBody.color,
                position: responseBody.position,
                state: MarkerState.Saved
            }
            return payload;
        }
        throw new Error(response.failure?.message);
    }
);

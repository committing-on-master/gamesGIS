import { createAsyncThunk } from "@reduxjs/toolkit";
import { LatLngExpression } from "leaflet";
import { ProfileMapDTO } from "../../api/dto/response/ProfileMapDTO";
import { RequestWrapper } from "../../api/JsonRequestWrapper";
import { addAreas, AreaType } from "../areas/slice";
import { setMap } from "../map/slice";

type fetchingProfileAction = {
    name: string,
    id: number,
}

export const profileFetching = createAsyncThunk<fetchingProfileAction, string>(
    "profile/Fetching",
    async (profileName: string, thunkApi) => {
        try {
            const response = await RequestWrapper.get<ProfileMapDTO, {}>(`maps/${profileName}`)
            if (response.ok && response.success) {
                const responsePayload = response.success.payload;

                const result: fetchingProfileAction = {
                    id: responsePayload.id,
                    name: responsePayload.name
                }

                thunkApi.dispatch(setMap(responsePayload.mapType, responsePayload.center, responsePayload.bound));

                const resAreas = responsePayload.points.map((area) => {
                    const mappedBound: LatLngExpression[] = area.aria.map((point) => [point.x, point.y]);
                    const mapped: AreaType = {
                        id: area.id,
                        name: area.name,
                        position: area.center,
                        bound: mappedBound,
                        color: area.color
                    }
                    return mapped;
                })
                thunkApi.dispatch(addAreas(resAreas));
                return result;

            }
            return thunkApi.rejectWithValue({ payload: response.failure });
        } catch (error) {
            return thunkApi.rejectWithValue(error);
        }
    }
)
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ErrorResponse } from "../../api/dto/ErrorResponse";
import { ProfileMapDTO } from "../../api/dto/response/MapProfileDTO";
import { MapType } from "../../api/dto/types/MapType";
import { Point } from "../../api/dto/types/Point";
import { RequestWrapper } from "../../api/JsonRequestWrapper";

interface ProfileArg {
    id: number;
    authorId: number;
    name: string;

    map: MapType;
    maxLayers: number;
    currentLayer: number;
    center: Point;
    bound: [Point, Point];

    minZoom: number,
    maxZoom: number
}

export const fetchMapProfile = createAsyncThunk<ProfileArg, string>(
    "mapProfile/fetching",
    async (profileName: string, thunkApi) => {
        return RequestWrapper.endPoint(`/map-profiles?name=${profileName}`).get().send<ProfileMapDTO, ErrorResponse>()
            .then(res => {
                if (res.ok && res.success) {
                    const resultBody = res.success.payload;
                    const actionPayload: ProfileArg = {
                        id: resultBody.id,
                        authorId: resultBody.userId,
                        name: resultBody.name,

                        map: resultBody.mapType,
                        bound: resultBody.bound,
                        center: resultBody.center,
                        maxLayers: resultBody.maxLayers,
                        currentLayer: resultBody.currentLayer,

                        minZoom: resultBody.minZoom,
                        maxZoom: resultBody.maxZoom
                    }
                    return actionPayload;
                }
                throw new Error(res.failure?.message);
            })
    }
);
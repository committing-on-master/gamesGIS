import { createSlice } from "@reduxjs/toolkit"
import { profileFetching } from "./thunks";

const enum ProfileStatus {
    Undefined = 0,
    New,
    Saved,
    Editing
}

interface ProfileState {
    name?: string;
    id?: number;
    status: ProfileStatus
}

const initialState: ProfileState = {
    name: undefined,
    status: ProfileStatus.Undefined
}

const profileSlice = createSlice({
    name: "profile",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => { builder
        .addCase(profileFetching.fulfilled, (state, action) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
            state.status = ProfileStatus.Saved;
        })
    }
});

export const profileReducer = profileSlice.reducer;

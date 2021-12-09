import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";
import { loginUser, logoutUser, startUp } from "./thunks";

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {},
    extraReducers: (builder) => { builder
        // login
        .addCase(loginUser.pending, (state) => {
            state.status = "fetch";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.status = "login";
            state.userName = action.payload.userName;
            state.userId =action.payload.userId;
        })
        .addCase(loginUser.rejected, (state) => {
            state.status = "logout";
            state.userName = undefined;
            state.userId = undefined;
        })
        
        // logout
        .addCase(logoutUser.fulfilled, (state) => {
            state.status = "logout";
            state.userName = undefined;
            state.userId = undefined;
        })
        // start up
        .addCase(startUp.fulfilled, (state, action) => {
            state.status = "login";
            state.userName = action.payload?.userName;
            state.userId = action.payload?.userId;
        })
    }
});

export default accountSlice.reducer;
// export const { logoutUser } = accountSlice.actions;
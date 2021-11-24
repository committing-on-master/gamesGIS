import { createSlice, PayloadAction  } from "@reduxjs/toolkit";

export interface IAccountState {
    name: string;
    email: string;
}

const initialState: IAccountState = {
    name: "",
    email: ""
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.name = action.payload;            
        }
    }
});

export const { loginUser } = accountSlice.actions;

export default accountSlice.reducer;
// export {}
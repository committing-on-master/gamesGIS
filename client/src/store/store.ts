import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import { accountReducer } from "./account/slice";
import { areasReducer } from "./areas/slice";
import { mapReducer } from "./map/slice";
import { profileReducer } from "./profile/slice";
// let reducers = combineReducers({accountSlice});

export const store = configureStore({
    reducer: {
        account: accountReducer,
        map: mapReducer,
        areas: areasReducer,
        profile: profileReducer
    },
    devTools: process.env.NODE_ENV !== "production",
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware()y
    //         .prepend(
    //             debugLoggingMiddleware

    // //             // you can also type middlewares manually
    // //             // untypedMiddleware as Middleware<(action: Action<'specialAction'>) => number, RootState >
    //         )
    // prepend and concat calls can be chained
    // .concat(debugLoggingMiddleware)
});

// типизированный алиас для стейта
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
import { Middleware } from "redux";
import { RootState, store } from "../store";

const debugLoggingMiddleware: Middleware = 
    storeApi => next => action => {
        if (typeof action !== "function") {
            console.log(`dispatched action.payload: ${action.payload}`);
        }
        next(action);
    }
// const debugLoggingMiddleware: Middleware<{}, RootState> =
//     storeApi => next => action => {
//         if (typeof action !== "function") {
//             console.log(`dispatched action.payload: ${action.payload}`);
//         }
//         next(action);
//     }

export { debugLoggingMiddleware };
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthDTO } from "../../api/dto/request/AuthDTO";
import { ErrorDTO } from "../../api/dto/response/ErrorDTO";
import { JwtDTO } from "../../api/dto/response/JwtDTO";
import { RequestWrapper } from "../../api/JsonRequestWrapper";

interface LoginThunkArg {
    userEmail: string;
    userPassword: string;
}

interface UserData {
    userName: string,
    userId: number
}

export const loginUser = createAsyncThunk<UserData, LoginThunkArg>(
    "account/Login",
    (data: LoginThunkArg, thunkApi) => {
        const body: AuthDTO = {
            email: data.userEmail,
            password: data.userPassword
        }
        return RequestWrapper.post<JwtDTO, ErrorDTO>("auth", body)
            .then(res => {
                if (res.ok && res.success?.payload) {
                    const result = res.success.payload;
                    RequestWrapper.JwtToken.Access = result.accessToken;
                    RequestWrapper.JwtToken.Refresh = result.refreshToken;
                    
                    const fulfilled: UserData = {
                        userName: RequestWrapper.JwtToken.Payload!.userName,
                        userId: RequestWrapper.JwtToken.Payload!.userId
                    }
                    return fulfilled;
                }
                return thunkApi.rejectWithValue({payload: res.failure});
            })
            .catch(error => {
                console.log(error);
                return thunkApi.rejectWithValue(error);
            })
    }
);

export const logoutUser = createAsyncThunk(
    "account/Logout",
    () => {
        RequestWrapper.JwtToken.Access = undefined;
        RequestWrapper.JwtToken.Refresh = undefined;
    }
)

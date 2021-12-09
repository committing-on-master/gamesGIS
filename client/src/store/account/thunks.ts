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
    async (data: LoginThunkArg, thunkApi) => {
        const body: AuthDTO = {
            email: data.userEmail,
            password: data.userPassword
        }
        try {
            const res = await RequestWrapper.post<JwtDTO, ErrorDTO>("auth", body);
            if (res.ok && res.success?.payload) {
                const result = res.success.payload;
                RequestWrapper.JwtToken.Access = result.accessToken;
                RequestWrapper.JwtToken.Refresh = result.refreshToken;

                const fulfilled: UserData = {
                    userName: RequestWrapper.JwtToken.Payload!.userName,
                    userId: RequestWrapper.JwtToken.Payload!.userId
                };

                saveLoginData(fulfilled);
                return fulfilled;
            }
            return thunkApi.rejectWithValue({ payload: res.failure });
        } catch (error) {
            console.log(error);
            return thunkApi.rejectWithValue(error);
        }
    }
);

export const logoutUser = createAsyncThunk(
    "account/Logout",
    () => {
        RequestWrapper.JwtToken.Access = undefined;
        RequestWrapper.JwtToken.Refresh = undefined;
        saveLoginData(undefined);
    }
)

export const startUp = createAsyncThunk(
    "account/startUp",
    (_, thunkApi) => {
        // TODO: нужен какой-нить сервис по агрегированию работы с хранилищами
        const data = loadLoginData();
        if (data && RequestWrapper.JwtToken.Refresh) {
            return data;
        }
        thunkApi.rejectWithValue("Failed loading user data");
    }
)

function saveLoginData(data: UserData | undefined) {
    if (data) {
        console.log("saving user data");
        console.log(data);
        localStorage.setItem("userName", data.userName);
        localStorage.setItem("userId", data.userId.toString());
        return;
    }
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
}

function loadLoginData(): UserData | undefined {
    const name = localStorage.getItem("userName");
    const id = localStorage.getItem("userId");
    if (name && id) {
        const result: UserData = {
            userId: parseInt(id, 10),
            userName: name
        }
        console.log("loaded user data");
        console.log(result);
        return result;
    }
    return undefined;
}
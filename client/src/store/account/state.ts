export interface AccountState {
    userName?: string;
    userId?: number;
    status: "logout" | "login" | "fetch";
}

export const initialState: AccountState = {
    userName: undefined,
    userId: undefined,
    status: "logout"
}

const Status = (state: AccountState) => state.status;
const UserName = (state: AccountState) => state.userName;
const UserId = (state: AccountState) => state.userId;

const UserData = (state: AccountState) => {
    if (UserId(state) && UserName(state)) {
        return {
            userId: UserId(state)!,
            userName: UserName(state)!
        }
    }
    return undefined;
}

export const accountSelectors = {
    Status, UserName, UserId, UserData
}
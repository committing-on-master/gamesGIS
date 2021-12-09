import { SuccessResponse } from "../SuccessResponse";

/**Тело удачного ответа создания jwt токенов*/
export interface Payload {
    accessToken: string;
    refreshToken: string;
}

export interface JwtDTO extends SuccessResponse<Payload> {}

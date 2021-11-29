import { IRequestOptions } from "./iRequestOptions";
import { IResult } from "./iResult ";

export interface IHttpMethods {
    get<TSuccessBody, TErrorBody>(endPoint: string, opt?: IRequestOptions): Promise<IResult<TSuccessBody, TErrorBody>>;

    post<TSuccessBody, TErrorBody>(endPoint: string, body: BodyInit | object , opt?: IRequestOptions): Promise<IResult<TSuccessBody, TErrorBody>>;
}
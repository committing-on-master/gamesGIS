import { RequestOptions } from "./RequestOptions";
import { Result } from "./iResult ";

export interface IHttpMethods {
    get<TSuccessBody, TErrorBody>(endPoint: string, opt?: RequestOptions): Promise<Result<TSuccessBody, TErrorBody>>;

    post<TSuccessBody, TErrorBody>(endPoint: string, body: BodyInit | object , opt?: RequestOptions): Promise<Result<TSuccessBody, TErrorBody>>;
}
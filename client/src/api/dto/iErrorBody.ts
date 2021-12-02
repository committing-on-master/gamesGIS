import { IError } from "./iError";

export interface IErrorBody {
    msg?: string;
    errors?: IError[];
}
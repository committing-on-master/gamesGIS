import { ErrorResponse } from './../ErrorResponse'

/** Формат ошибок express-validator */
interface Payload {
    /** Сообщение об ошибке */
    msg: string;

    /** Полученное значение */
    value?: string;
    /** Параметр запроса, содержащий значение */
    param?: string;
    /** Расположение параметра в запросе body | params | header etc*/
    location?: string;
}

export interface ErrorDTO extends ErrorResponse<Payload[]> {};

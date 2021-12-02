/** Формат ошибок express-validator */
export interface IError {
    /** Сообщение об ошибке */
    msg: string;

    /** Полученное значение */
    value?: string;
    /** Параметр запроса, содержащий значение */
    param?: string;
    /** Расположение параметра в запросе body | params | header etc*/
    location?: string;
}
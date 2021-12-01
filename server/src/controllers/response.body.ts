interface IResponseBody {
    msg?: string;
}

interface IErrorBody extends IResponseBody {
    errors?: IError[];
}

interface ISuccessBody<T> extends IResponseBody {
    payload?: T;
}

/** Формат ошибок express-validator */
interface IError {
    /** Сообщение об ошибке */
    msg: string;

    /** Полученное значение */
    value?: string;
    /** Параметр запроса, содержащий значение */
    param?: string;
    /** Расположение параметра в запросе body | params | header etc*/
    location?: string;
}

abstract class ResponseBody {
    public static jsonEmpty() {
        return {};
    }

    public static jsonOk<T = null>(message?: string, dto?: T): ISuccessBody<T> {
        const result: ISuccessBody<T> = {};

        if (message) {
            result.msg = message;
        }

        if (dto) {
            result.payload = dto;
        }
        return result;
    }

    public static jsonError(message?: string, errors?: IError[]): IErrorBody {
        const result: IErrorBody = {};

        if (message) {
            result.msg = message;
        }

        if (errors && errors.length !== 0) {
            result.errors = errors;
        }

        return result;
    }
}

export {ResponseBody};

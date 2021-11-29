export interface IResult<TSuccessBody, TErrorBody> {
    /**
     * true - response codes [200, 300)
     * false - response codes [100, 200) U [300, 526+]
     */
    ok: boolean;
    /**код ответа */
    code: number;
    /**распарсеное тело удачного ответа */
    successBody?: TSuccessBody;
    /**распарсеное тело ошибки от сервера */
    errorBody?: TErrorBody;
}
export interface Result<TSuccessBody, TErrorBody> {
    /**
     * true - response codes [200, 300)
     * false - response codes [100, 200) U [300, 526+]
     */
    ok: boolean;
    /**код ответа */
    code: number;
    /**тело удачного ответа */
    success?: TSuccessBody;
    /**тело с описанием ошибки*/
    failure?: TErrorBody;
}
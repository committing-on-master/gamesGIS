import { IHttpMethods } from "./iHttpMethods";
import { IRequestOptions } from "./iRequestOptions";
import { IResult } from "./iResult ";

class JsonRequestWrapper implements IHttpMethods {
    private static domain = "localhost";
    private static port = 3000;

    private predefinedHeaders = new Headers ({
        "Content-type": "application/json; charset=UTF-8"
    })

    // private constructor(endPoint: string, requestOpt: RequestInit) {}

    private get Host(): string { return `http://${JsonRequestWrapper.domain}:${JsonRequestWrapper.port}` }
    private getUrl(endPoint: string) { return `${this.Host}/${endPoint}` }

    
    public get withAuth(): IHttpMethods {
        // проверка токена на протухание, если протух то перевыпускаем
        // если не смогли перевыпустить, то возвращаем заглушку выдающую 403 на любые запросы
        // если токен збс, или смогли перевыпустить, то создаем новый объект и заталкиваем в хидер авторизацию
        return new FailedAuthDummy();
        // return new JsonRequestWrapper();
    }

    /**
     * Обертка над get запросом. Получаем пакеты только в application/json формате
     * @template TSuccessBody ожидаемый формат ответа от сервера в случае успеха (коды 200-299)
     * @template TErrorBody ожидаемый формат ответа от сервера с ошибками
     * @param endPoint endpoint для запроса
     * @param opt параметры запроса
     * @return {Promise< IResult<TSuccessBody, TErrorBody> >} промис с наложенным(mapped) результатом ответа
     * @throws при проблемах с установлением соединения, или при неверном формате ответа сервера
     */
    public get<TSuccessBody, TErrorBody>(endPoint: string, opt: IRequestOptions = {}): Promise<IResult<TSuccessBody, TErrorBody>> {
        const requestOpt: RequestInit = {
                                            ...opt,
                                            method: "GET",
                                            headers: {...this.predefinedHeaders, ...opt.headers }
                                        };

        return this.exec<TSuccessBody, TErrorBody>(endPoint, requestOpt);
    }

    /**
     * Обертка над post запросом. Отправляем и получаем пакеты только в application/json формате
     * @template TSuccessBody ожидаемый формат ответа от сервера в случае успеха (коды 200-299)
     * @template TErrorBody ожидаемый формат ответа от сервера с ошибками
     * @param endPoint endpoint для запроса
     * @param body тело запроса
     * @param opt параметры запроса
     * @return {Promise< IResult<TSuccessBody, TErrorBody> >} промис с наложенным(mapped) результатом ответа
     * @throws при проблемах с установлением соединения, или при неверном формате ответа сервера
     */
    public post<TSuccessBody, TErrorBody>(endPoint: string, body: BodyInit | object , opt: IRequestOptions = {}) {
        if (typeof body === "object") {
            body = JSON.stringify(body);
        }

        const requestOpt: RequestInit = {
                                            ...opt,
                                            method: "POST",
                                            body: body,
                                            headers: {...this.predefinedHeaders, ...opt.headers }
                                        };

        return this.exec<TSuccessBody, TErrorBody>(endPoint, requestOpt);
    }

    private exec<TSuccessBody, TErrorBody>(endPoint: string, requestOpt: RequestInit): Promise<IResult<TSuccessBody, TErrorBody>> {
        const url = this.getUrl(endPoint);

        return fetch(url, requestOpt)
            .then(response => {
                const contentHeader = response.headers.get("Content-Type");
                if (contentHeader && contentHeader.indexOf("application/json") !== -1) {
                    if (response.ok) {
                        // 200-299
                        return Promise
                            .resolve(response.json()) // резолвимся промисом на json success дтошки
                            .then((okJson) => {
                                return Promise.resolve({ ok: true, code: response.status, body: okJson }) // заворачиваем тело с кодом в success объект
                            })
                    } else {
                        // другие error коды, ответ от сервера пришел в штатном режиме
                        return Promise
                            .resolve(response.json()) // резолвимся промисом на json штатного error-а
                            .then((errorJson) => {
                                return Promise.resolve({ ok: false, code: response.status, body: errorJson }) // заворачиваем код ответа с телом штатного error-а в отклоненный промис
                            });
                    }
                } 
                throw new Error("Unexpected response type content-type. Json response only!");
            })
            .then((response) => {
                const result: IResult<TSuccessBody, TErrorBody> = {
                    ok: response.ok,
                    code: response.code
                }
                if (response.ok) {
                    result.successBody = response.body as TSuccessBody;
                } else {
                    result.errorBody = response.body as TErrorBody;
                }
                return Promise.resolve(result);
            })
    }
}

class FailedAuthDummy implements IHttpMethods {
    private static rejectPromise = Promise.resolve({ ok: false, code: 401 });
    
    get = () => FailedAuthDummy.rejectPromise;
    post = () => FailedAuthDummy.rejectPromise;
}

export const RequestWrapper = new JsonRequestWrapper();
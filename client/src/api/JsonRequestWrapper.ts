import { JwtDTO } from "./dto/response/JwtDTO";
import { IHttpMethods } from "./iHttpMethods";
import { RequestOptions } from "./RequestOptions";
import { Result } from "./iResult ";
import { JwtToken } from "./jwtToken";

class JsonRequestWrapper implements IHttpMethods {
    private static jwtToken = new JwtToken();
    private static domain = "localhost";
    private static port = 3000;

    
    public get JwtToken() : JwtToken {
        return JsonRequestWrapper.jwtToken;
    }

    public static async LoadToken() {
        const tokens = this.jwtToken;
        if (tokens.Access) {
            if (tokens.ExpirationTimeout && tokens.ExpirationTimeout > 5 * 1000) {
                return; // access токен есть и срок его жизни превышает 5 секунд, то обновлять не надо
            }
        }

        if (!tokens.Refresh) {
            return; // refresh токена нет, отправлять нечего
        }
        this.exec<JwtDTO, null>("auth/refresh-token", {body:JSON.stringify({refreshToken: tokens.Refresh}),  method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}})
            .then(res => {
                if (res.ok) {
                    tokens.Access = res.success?.payload.accessToken;
                    tokens.Refresh = res.success?.payload.refreshToken;
                    return Promise.resolve();
                }
                return Promise.reject(res.failure);
            })
    }
    
    private predefinedHeaders = new Headers ({
        "Content-type": "application/json; charset=UTF-8"
    })

    public static get Host(): string { return `http://${JsonRequestWrapper.domain}:${JsonRequestWrapper.port}` }
    private static getUrl(endPoint: string) { return `${this.Host}/${endPoint}` }
    
    public get withAuth(): Promise<IHttpMethods> {
        const tokens = JsonRequestWrapper.jwtToken;
        if (!tokens.Refresh) {
            return Promise.resolve(new FailedAuthDummy()); // рефреш токен отсутствует, авторизация не доступна
        }
        const result = new JsonRequestWrapper();
        if (tokens.Access && tokens.ExpirationTimeout && tokens.ExpirationTimeout > 5 * 1000) {
            result.predefinedHeaders.set("Authorization", `Bearer ${tokens.Access}`); //access пока не протух
            return Promise.resolve(result);
        }

        return JsonRequestWrapper.exec<JwtDTO, null>("auth/refresh-token", {body:JSON.stringify({refreshToken: tokens.Refresh}),  method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}})
            .then(res => {
                if (res.ok) { // схоронили перевыпущеные токены, запихали в заголовок новый
                    tokens.Access = res.success?.payload.accessToken;
                    tokens.Refresh = res.success?.payload.refreshToken;
                    
                    result.predefinedHeaders.set("Authorization", `Bearer ${tokens.Access}`);
                    return Promise.resolve(result); 
                }
                return Promise.reject(res.failure);
            })
    }

    /**
     * Обертка над get запросом. Получаем пакеты только в application/json формате
     * @template TSuccessBody ожидаемый формат ответа от сервера в случае успеха (коды 200-299)
     * @template TErrorBody ожидаемый формат ответа от сервера с ошибками
     * @param endPoint endpoint для запроса
     * @param opt параметры запроса
     * @return {Promise< Result<TSuccessBody, TErrorBody> >} промис с наложенным(mapped) результатом ответа
     * @throws при проблемах с установлением соединения, или при неверном формате ответа сервера
     */
    public get<TSuccessBody, TErrorBody = null>(endPoint: string, opt: RequestOptions = {}): Promise<Result<TSuccessBody, TErrorBody>> {
        const requestOpt: RequestInit = {
                                            ...opt,
                                            method: "GET",
                                            headers: {...this.predefinedHeaders, ...opt.headers }
                                        };

        return JsonRequestWrapper.exec<TSuccessBody, TErrorBody>(endPoint, requestOpt);
    }

    /**
     * Обертка над post запросом. Отправляем и получаем пакеты только в application/json формате
     * @template TSuccessBody ожидаемый формат ответа от сервера в случае успеха (коды 200-299)
     * @template TErrorBody ожидаемый формат ответа от сервера с ошибками
     * @param endPoint endpoint для запроса
     * @param body тело запроса
     * @param opt параметры запроса
     * @return {Promise< Result<TSuccessBody, TErrorBody> >} промис с наложенным(mapped) результатом ответа
     * @throws при проблемах с установлением соединения, или при неверном формате ответа сервера
     */
    public post<TSuccessBody, TErrorBody = null>(endPoint: string, body: BodyInit | object , opt: RequestOptions = {}) {
        if (typeof body === "object") {
            body = JSON.stringify(body);
        }

        const headers = opt.headers ? new Headers(opt.headers) : new Headers();
        this.predefinedHeaders.forEach((value, key) => {
            headers.set(key, value);
        })

        const requestOpt: RequestInit = {
                                            ...opt,
                                            method: "POST",
                                            body: body,
                                            headers: headers
                                        };

        return JsonRequestWrapper.exec<TSuccessBody, TErrorBody>(endPoint, requestOpt);
    }

    private static exec<TSuccessBody, TErrorBody>(endPoint: string, requestOpt: RequestInit): Promise<Result<TSuccessBody, TErrorBody>> {
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
                const result: Result<TSuccessBody, TErrorBody> = {
                    ok: response.ok,
                    code: response.code
                }
                if (response.ok) {
                    result.success = response.body as TSuccessBody;
                } else {
                    result.failure = response.body as TErrorBody;
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
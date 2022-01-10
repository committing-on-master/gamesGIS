import { JwtDTO } from "./dto/response/JwtDTO";
import { RequestOptions } from "./RequestOptions";
import { Result } from "./iResult ";
import { JwtToken } from "./jwtToken";

interface IRequestWrapper extends IRequestMethods {
    withAuth(): IRequestWrapper
}

interface ISend {
    send<TSuccessBody,TErrorBody = {}>(opt?: RequestOptions): Promise<Result<TSuccessBody, TErrorBody>>;
}

interface IRequestMethods {
    get(): ISend;
    post(body: BodyInit | object): ISend;
    put(body: BodyInit | object): ISend;
}

type Options = {
    method?: "post" | "get" | "put";
    url: string;
    authToken: boolean;
    headers: Headers;
    body?: BodyInit;
}

class RequestWrapper implements IRequestWrapper {
    private static jwtToken = new JwtToken();

    public static get JwtToken() : JwtToken {
        return RequestWrapper.jwtToken;
    }

    private opt: Options;
    
    private constructor(url: string) {
        this.opt = {
            url : url,
            authToken: false,
            headers: new Headers()
        }
    }    
    
    public static endPoint(endPoint: string) {        
        return new RequestWrapper(this.getUrl(endPoint));
    }
    
    
    private static getUrl(endPoint: string) {
        const api = process.env.REACT_APP_API_URL;
        if (!api) {
            throw new Error("REACT_APP_API_URL variable is undefined");
        }
        return `http://${api}/${endPoint}`;
    }

    withAuth(): IRequestWrapper {
        this.opt.authToken = true;
        return this;
    }

    public get(): ISend {
        this.opt.method = "get";
        return this;
    }
    public post(body: BodyInit | object = {}): ISend {
        this.opt.method = "post";
        if (typeof body === "object") {
            body = JSON.stringify(body);
        }
        this.opt.body = body;
        this.opt.headers.set("Content-type", "application/json")
        return this;
    }
    public put(body: BodyInit | object = {}): ISend {
        this.opt.method = "put";
        if (typeof body === "object") {
            body = JSON.stringify(body);
        }
        this.opt.body = body;
        this.opt.headers.set("Content-type", "application/json")
        return this;
    }

    public async send<TSuccessBody, TErrorBody>(opt: RequestOptions = {}): Promise<Result<TSuccessBody, TErrorBody>> {
        if (this.opt.authToken) {
            await this.addBearerHeader();
        }

        const headers = opt.headers ? new Headers(opt.headers) : new Headers();
        this.opt.headers.forEach((value, key) => {
            headers.set(key, value);
        })

        const requestOpt: RequestInit = {
            ...opt,
            method: this.opt.method,
            body: this.opt.body,
            headers: headers
        };

        return this.exec<TSuccessBody, TErrorBody>(this.opt.url, requestOpt);
    }

    private async addBearerHeader() {
        this.getAccessToken()
        .then(token => {
            if(token) {
                this.opt.headers.set("Authorization", `Bearer ${token}`);
                return Promise.resolve();
            }
            return Promise.reject();
        })
    }

    private async getAccessToken() {
        const tokens = RequestWrapper.jwtToken;
        if (tokens.Access) {
            if (tokens.ExpirationTimeout && tokens.ExpirationTimeout > 10 * 1000) {
                this.opt.headers.set("Authorization", `Bearer ${tokens.Access}`);
                return Promise.resolve(tokens.Access); // access токен есть и срок его жизни превышает 10 секунд, должно хватить
            }
        }

        if (!tokens.Refresh) {
            return Promise.reject("Refresh token not found. Manual relogin required."); // refresh токена нет, новый access получить не можем
        }

        return this.exec<JwtDTO, null>(RequestWrapper.getUrl("auth/refresh-token"), {body:JSON.stringify({refreshToken: tokens.Refresh}),  method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}})
            .then(res => {
                if (res.ok) {
                    tokens.Access = res.success?.payload.accessToken;
                    tokens.Refresh = res.success?.payload.refreshToken;
                    return Promise.resolve(tokens.Access);
                }
                return Promise.reject(res.failure);
            })
    }


    private exec<TSuccessBody, TErrorBody>(url: string, requestOpt: RequestInit): Promise<Result<TSuccessBody, TErrorBody>> {
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

export { RequestWrapper };

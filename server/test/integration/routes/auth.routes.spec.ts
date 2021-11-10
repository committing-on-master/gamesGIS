import "reflect-metadata";
import argon2 from "argon2";
import chai, { expect } from "chai";
import express from "express";
import supertestServ from "supertest";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import winston from "winston";
import { anyString, instance, mock, reset, resetCalls, verify, when } from "ts-mockito";

import { AuthController } from "../../../src/controllers/auth/auth.controller";
import { AuthMiddleware } from "../../../src/controllers/auth/auth.middleware";
import { AuthRoutes } from "../../../src/controllers/auth/auth.routes.config";
import { ServicesLayer } from "../../../src/services-layer/services.layer";
import { UsersService } from "../../../src/services-layer/users/users.service";
import { JwtPayload } from "../../../src/controllers/common-types/jwt.payload";
import { UsersDAO } from "../../../src/data-layer/models/users.dao";
import { RefreshTokensDao } from "../../../src/data-layer/models/refresh.tokens.dao";

/**
 * Хелпер помогающий работать с ts-mockito
 * Необходимый из-за его странной механики:
 * - вначале сделать прокси объект
 * - потом наворотить на него функциональность
 * - и лишь в конце получить готовую сущность для теста, запретив при этом регистрировать на нее доп функциональность
 */
class Brick<T> {
    readonly proxy: T;
    private mock?: T;

    /**
     * Создает обертку вокруг proxy: T сущности
     * @param proxy Созданный ранее прокси объект, для случаев каких-то нестандартных регистраций
     * @description Если при тестах улетаешь в таймаут, возможно прокси создан не верно и getter Instance залипает на создании финальной сущности.
     * Проверь доку ts-mockito, возможность мокаешь не верно.
     */
    constructor(proxy: T) {
        this.proxy = proxy;
    }

    /**
     * Предоставляет коллбэк, прокидывая внутрь прокси-мок объект, позволяя повешать на него требуемую функциональность
     * @param callBack колллбэк для определения функциональности
     * @returns Текущий объект, позволяя собирать цепочку расширяющих колбэков.
     */
    public addMock(callBack: (proxy: T) => any ): Brick<T> {
        if (!mock) {
            throw new Error("Proxy object locked because instance already created.");
        }
        callBack(this.proxy);
        return this;
    }
    /**
     * Сбрасывает счетчик вызовов методов/полей на mock объекте
     */
    public resetCalls() { resetCalls(this.proxy); }
    /**
     * Сбрасывает всю зарегистрированную функциональность на mock объекте
     */
    public reset() {
        reset(this.proxy);
        this.mock = undefined; 
    }
    
    /**
     * Заворачивает прокси-мок в результирующий объект
     * Кэширует результат
     */
    public get Instance() : T {
        if (!this.mock) {
            this.mock = instance(this.proxy);
        }
        return this.mock;
    }
}

class TestData {
    logger = new Brick(mock<winston.Logger>());
    userService = new Brick(mock(UsersService));
    serviceLayer = new Brick(mock(ServicesLayer));
    usersStub = new Brick(mock(UsersDAO));
    refreshTokenStub = new Brick(mock(RefreshTokensDao));

    jwtSecret: string = "S#cReT$tr1ng";
    jwtExpiration: number = 60;
}

class TestDataBuilder {
    data: TestData;
    
    authMiddleware?: AuthMiddleware;
    authController?: AuthController;
    testRoutes?: AuthRoutes;    

    constructor(){
        this.data = new TestData();
        this.defaultPremitiveValues();
    }

    private defaultPremitiveValues(){
        this.data.jwtSecret = "S#cReT$tr1ng";
        this.data.jwtExpiration = 60;
    }

    public addStep(callback: (d: TestData) => void): TestDataBuilder {
        callback(this.data);
        return this;
    }

    public get Data(): TestData {
        return this.data;
    }

    public reset() {
        this.data.logger.reset();
        // this.data.logger.addMock(logger => when(logger.info(anyString())).thenCall((str) => console.log(str)));        
        this.data.serviceLayer.reset();
        this.data.userService.reset();
        this.data.usersStub.reset();

        this.defaultPremitiveValues();        
    }

    public getTestedInstance(): AuthRoutes {
        this.data.serviceLayer.addMock(layer => when(layer.usersService).thenReturn(this.data.userService.Instance));

        this.authController = this.authController ?? new AuthController(this.data.logger.Instance, 
                                                                        this.data.jwtSecret,
                                                                        this.data.jwtExpiration,
                                                                        this.data.serviceLayer.Instance);

        this.authMiddleware = this.authMiddleware ?? new AuthMiddleware(this.data.logger.Instance,
                                                                        this.data.jwtSecret,
                                                                        this.data.serviceLayer.Instance);

        this.testRoutes = this.testRoutes ?? new AuthRoutes(this.data.logger.Instance,
                                                            this.authController,
                                                            this.authMiddleware);
        return this.testRoutes;
    }
}

describe("Сценарии создания JWT токена", function(){
    let builder = new TestDataBuilder();
    let expressApp: express.Application;

    function manualResetTestInstances() {
        builder.reset();
        expressApp = express();
        expressApp.use(express.json());
    };

    context("Группа тестов на валидацию схемы полей генерации нового токена", function() {
        before(function() {
            manualResetTestInstances();
            builder
                // вешаем роуты на тестовый експресс
                .getTestedInstance().registerRoutes(expressApp);
        })
        const requestsBody: {msg: string, body: string, expected: {code: number, problemField: string }}[] = [
            {
                msg: "Отсутствует поле пароля",
                body: JSON.stringify({ email: "marcos.henrique@toptal.com"}),
                expected: {code: 400, problemField: "password" } 
            },
            {
                msg: "email задан в неверном формате - без собаки",
                body: JSON.stringify({ email: "marcos.henriquetoptal.com"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "email задан в неверном формате - без домена верхнего уровня",
                body: JSON.stringify({ email: "marcos.henriquetop@talcom"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "email задан в неверном формате - без ящика",
                body: JSON.stringify({ email: "@toptal.com"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "Пароль слишком короткий",
                body: JSON.stringify({ password: "Some"}),
                expected: {code: 400, problemField: "password" } 
            },
            {
                msg: "Пароль слишком длинный",
                body: JSON.stringify({ password: "I'm_the_hero_of_the_story.Don't_need_to_be_saved"}),
                expected: {code: 400, problemField: "password" } 
            }
        ];

        requestsBody.forEach(function(testCase) {
            it(testCase.msg, async function() {
                let response = await supertestServ(expressApp)
                    .post('/auth')
                    .set("Content-Type", "application/json")
                    .send(testCase.body);
                    
                chai.expect(response.statusCode).equal(testCase.expected.code);
                chai.expect(response.body, "Свойство errors отсутствует в ответе").have.property("errors");                
                chai.expect(
                    (response.body.errors as Array<{param: string}>).some((item) => item.param === testCase.expected.problemField),
                    `ожидали получить ошибочный ответ с полем: ${testCase.expected.problemField}`
                    ).to.be.true;
                    
            })
        });
    })

    context("Сценарий создания JWT токена", function() {
        let password = "Pas77Wo88!";
        let email = "gachi@tarkov.gay";
        let userId = 323;

        let testBody = JSON.stringify({ 
            password: password,
            email: email
        });

        before(async function() {
            manualResetTestInstances();
            let passwordHash = await getHash(password)

            builder
            // говорим чтоб userdb по запросу пароля через почту, возвращал ранее посчитанный хэш и имел id-шник
            .addStep( d => { d.usersStub.addMock(user => when(user.passwordHash).thenReturn(passwordHash))
                                        .addMock(user => when(user.id).thenReturn(userId))
                                        .addMock(user => when(user.email).thenReturn(email)) })
            // мок сервиса возвращает модельку userdb
            .addStep(d=> d.userService.addMock(uService => when(uService.getUserByEmail(email)).thenResolve(d.usersStub.Instance) ))
            // регаем роуты на тестовый экспресс
            .getTestedInstance().registerRoutes(expressApp);
        });

        it("Удачный сценарий", async function() {
            let response = await supertestServ(expressApp)
                .post("/auth")
                .set("Content-Type", "application/json")
                .send(testBody);
            
            chai.expect(response.statusCode).to.be.equal(201);

            chai.expect(response.body.accessToken, "Отсутствует access токен в ответе").to.not.null;
            chai.expect(response.body.accessToken, "Ожидали получить access токен в виде строки").to.be.string;

            chai.expect(response.body.refreshToken, "Отсутствует refresh token в ответе").to.not.null;
            chai.expect(response.body.refreshToken, "Ожидали получить refresh token в виде строки").to.be.string;

            let mockedServiсe = builder.data.userService.proxy;
            verify(mockedServiсe.updateUserRefreshToken(userId, anyString())).once();
        })
    })

    context("Пользователь получает 403 при попытке создания токена c невалидными данными", function() {
        let password = "Pas77Wo88!";
        let email = "gachi@tarkov.gay";

        const testCase: {msg: string, body: string, expectedCode: number }[] = [
            {
                msg: "Указан не верный пароль",
                body: JSON.stringify({ email: email, password: password + "rndtxt"}),
                expectedCode: 403
            },
            {
                msg: "Указан не существующий пользователь",
                body: JSON.stringify({ email: "rndtxt" + email, password: password }),
                expectedCode: 403
            }
        ];

        before(async function() {            
            manualResetTestInstances();
            let passwordHash = await getHash(password);

            builder
            // говорим чтоб userdb по запросу пароля через почту, возвращал ранее посчитанный хэш
            .addStep( d => d.usersStub.addMock(u => when(u.passwordHash).thenReturn(passwordHash)) )
            // мок сервиса возвращает модельку userdb
            .addStep(d=> d.userService.addMock(s => when(s.getUserByEmail(email)).thenResolve(d.usersStub.Instance) ) )
            // регаем роуты на тестовый экспресс
            .getTestedInstance().registerRoutes(expressApp);
        });

        testCase.forEach(function(testCase) {
            it(testCase.msg, function(done) {
                supertestServ(expressApp)
                    .post('/auth')
                    .set("Content-Type", "application/json")
                    .send(testCase.body)
                    .expect(403)
                    .end(done);
            }
        )});
    });

    context("Использование refresh token-а для получения нового", function() {
        let userId = 562;
        let permissionFlag = 1;
        let email = "name@domain.com";
        builder.data.jwtExpiration = 0;

        let { accessToken, refreshToken } = getTokens({userId: userId, permissionFlag: permissionFlag}, 
                                                       email,
                                                       builder.data.jwtSecret,
                                                       builder.data.jwtExpiration);
        
        before(async function() {
            manualResetTestInstances();
            builder
            .addStep(data => data.refreshTokenStub.addMock(token => when(token.token).thenReturn(refreshToken))
                                                  .addMock(token => when(token.revoked).thenReturn(false))
                                                  .addMock(token => when(token.expiredDate).thenReturn(new Date(2042, 2,23))))
            .addStep(data => data.usersStub.addMock(user => when(user.id).thenReturn(userId))
                                           .addMock(user => when(user.email).thenReturn(email)))
            .addStep(data => data.userService.addMock(service => when(service.getRefreshTokenByUserId(userId)).thenResolve(data.refreshTokenStub.Instance))
                                             .addMock(service => when(service.getUserById(userId)).thenResolve(data.usersStub.Instance)))
            
            .getTestedInstance().registerRoutes(expressApp);
        });

        it("Просроченный access token, валидный refresh, удачный сценарий перевыпуска", async function() {
            let response = await supertestServ(expressApp)
                .post("/auth/refresh-token")
                .set("Content-Type", "application/json")
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({ refreshToken });

            expect(response.statusCode).to.be.equal(201);

            expect(response.body).not.to.be.empty;
            expect(response.body.accessToken,"Отсутствует новый access token").to.not.null;
            expect(response.body.accessToken, "Ожидали access токен в виде строки").to.be.string;
            expect(response.body.refreshToken, "Отсутствует refresh token").to.not.null;
            expect(response.body.refreshToken, "Ожидали refresh token в виде строки").to.be.string;
            expect(response.body.refreshToken, "Новый refresh токен не отличается от старого").to.not.equal(refreshToken);
            
            let mockedServiсe = builder.data.userService.proxy;
            verify(mockedServiсe.updateUserRefreshToken(userId, anyString())).once();
        })
    });
});

async function getHash(str:string) {
    return await argon2.hash(str)
}

function getTokens(jwtPayload: JwtPayload,
                   email: string,
                   jwtSecret: string,
                   tokenExpirationInSeconds: number): {accessToken: string, refreshToken: string} {
    const salt = crypto.createSecretKey(crypto.randomBytes(16));
    const refreshToken = crypto.createHmac('sha512', salt)
                                .update(email)
                                .digest('base64');    
    const token = jwt.sign(jwtPayload, jwtSecret, { expiresIn: tokenExpirationInSeconds });
    return {accessToken: token, refreshToken: refreshToken}
}
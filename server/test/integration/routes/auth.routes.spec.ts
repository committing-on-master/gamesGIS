import "reflect-metadata";
import { expect } from "chai";
import express from "express";
import supertestServ from "supertest";
import winston from "winston";
import { anyString, mock, verify, when } from "ts-mockito";

import { CryptoHelper } from "./../../helpers/crypto.helper"
import { TestDataBuilder } from "./../../helpers/test.data.builder";
import { Brick } from "../../helpers/brick";

import { AuthController } from "../../../src/controllers/auth/auth.controller";
import { AuthMiddleware } from "../../../src/controllers/auth/auth.middleware";
import { AuthRoutes } from "../../../src/controllers/auth/auth.routes.config";
import { ServicesLayer } from "../../../src/services-layer/services.layer";
import { UsersService } from "../../../src/services-layer/users/users.service";
import { UsersDAO } from "../../../src/data-layer/models/users.dao";
import { RefreshTokensDao } from "../../../src/data-layer/models/refresh.tokens.dao";

/**Данные используемые в тестах */
class TestData {
    logger = new Brick(mock<winston.Logger>());
    userService = new Brick(mock(UsersService));
    serviceLayer = new Brick(mock(ServicesLayer));
    usersStub = new Brick(mock(UsersDAO));
    refreshTokenStub = new Brick(mock(RefreshTokensDao));

    jwtSecret: string = "S#cReT$tr1ng";
    jwtExpiration: number = 60;
}

class AuthTestDataBuilder extends TestDataBuilder<TestData, AuthRoutes> {    
    authMiddleware?: AuthMiddleware;
    authController?: AuthController;

    constructor(){
        super(new TestData());
        this.defaultPremitiveValues();
    }

    private defaultPremitiveValues(){
        this.data.jwtSecret = "S#cReT$tr1ng";
        this.data.jwtExpiration = 60;
    }

    public reset() {
        this.data.logger.reset();
        // this.data.logger.addMock(logger => when(logger.info(anyString())).thenCall((str) => console.log(str)));
        this.data.serviceLayer.reset();
        this.data.userService.reset();
        this.data.usersStub.reset();

        this.defaultPremitiveValues();        
    }

    public get TestedInstance(): AuthRoutes {
        this.data.serviceLayer.addMock(layer => when(layer.usersService).thenReturn(this.data.userService.Instance));

        this.authController = new AuthController(this.data.logger.Instance, 
                                                 this.data.jwtSecret,
                                                 this.data.jwtExpiration,
                                                 this.data.serviceLayer.Instance);

        this.authMiddleware = new AuthMiddleware(this.data.logger.Instance,
                                                 this.data.jwtSecret,
                                                 this.data.serviceLayer.Instance);

        this.testedInstance = new AuthRoutes(this.data.logger.Instance,
                                             this.authController,
                                             this.authMiddleware);
        return this.testedInstance;
    }
}

describe("Сценарии создания JWT токена", function(){
    let builder = new AuthTestDataBuilder();
    let expressApp: express.Application;

    /**
     * Игрался с beforeEach, проиграл. За сим, дергаем руками в каждом тесте
     */
    function manualResetTestInstances() {
        builder.reset();
        expressApp = express();
        expressApp.use(express.json());
    };

    context("Группа тестов на валидацию схемы полей генерации нового токена", function() {
        before(function() {
            manualResetTestInstances();
            builder.TestedInstance.registerRoutes(expressApp);
        })
        const requestsBody: {msg: string, body: string, expected: {code: number, problemField: string }}[] = [
            {
                msg: "Отсутствует поле пароля",
                body: JSON.stringify({ email: "marcos.henrique@toptal.com"}),
                expected: {code: 400, problemField: "password" } 
            },
            {
                msg: "email задан в неверном формате - без собаки",
                body: JSON.stringify({ email: "marcos.henriquetoptal.com", password: "TheLongestLeg"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "email задан в неверном формате - без домена верхнего уровня",
                body: JSON.stringify({ email: "marcos.henriquetop@talcom", password: "TheLongestLeg"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "email задан в неверном формате - без ящика",
                body: JSON.stringify({ email: "@toptal.com", password: "TheLongestLeg" }),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "Пароль слишком короткий < 5",
                body: JSON.stringify({ password: "Five5", email: "gachi@tarkov.com"}),
                expected: {code: 400, problemField: "password" } 
            }
        ];

        requestsBody.forEach(function(testCase) {
            it(testCase.msg, async function() {
                let response = await supertestServ(expressApp)
                    .post('/auth')
                    .set("Content-Type", "application/json")
                    .send(testCase.body);
                    
                expect(response.statusCode).equal(testCase.expected.code);
                expect(response.body, "Свойство errors отсутствует в ответе").have.property("errors");                
                expect(
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
            let passwordHash = await CryptoHelper.getHash(password)

            builder
            // говорим чтоб userdb по запросу пароля через почту, возвращал ранее посчитанный хэш и имел id-шник
            .addStep( d => { d.usersStub.addMock(user => when(user.passwordHash).thenReturn(passwordHash))
                                        .addMock(user => when(user.id).thenReturn(userId))
                                        .addMock(user => when(user.email).thenReturn(email)) })
            // мок сервиса возвращает модельку userdb
            .addStep(d=> d.userService.addMock(uService => when(uService.getUserByEmail(email)).thenResolve(d.usersStub.Instance))
                                      .addMock(uService => when(uService.getUserById(userId)).thenResolve(d.usersStub.Instance)))
            // регаем роуты на тестовый экспресс
            .TestedInstance.registerRoutes(expressApp);
        });

        it("Удачный сценарий", async function() {
            let response = await supertestServ(expressApp)
                .post("/auth")
                .set("Content-Type", "application/json")
                .send(testBody);
            
            expect(response.statusCode).to.be.equal(201);

            expect(response.body.accessToken, "Отсутствует access токен в ответе").to.not.null;
            expect(response.body.accessToken, "Ожидали получить access токен в виде строки").to.be.string;

            expect(response.body.refreshToken, "Отсутствует refresh token в ответе").to.not.null;
            expect(response.body.refreshToken, "Ожидали получить refresh token в виде строки").to.be.string;

            let mockedServiсe = builder.Data.userService.proxy;
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
            let passwordHash = await CryptoHelper.getHash(password);

            builder
            // говорим чтоб userdb по запросу пароля через почту, возвращал ранее посчитанный хэш
            .addStep( d => d.usersStub.addMock(u => when(u.passwordHash).thenReturn(passwordHash)) )
            // мок сервиса возвращает модельку userdb
            .addStep(d=> d.userService.addMock(s => when(s.getUserByEmail(email)).thenResolve(d.usersStub.Instance) ) )
            // регаем роуты на тестовый экспресс
            .TestedInstance.registerRoutes(expressApp);
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
        builder.Data.jwtExpiration = 0;

        let { accessToken, refreshToken } = CryptoHelper.getTokens({userId: userId, permissionFlag: permissionFlag}, 
                                                                    email,
                                                                    builder.Data.jwtSecret,
                                                                    builder.Data.jwtExpiration);
        
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
            
            .TestedInstance.registerRoutes(expressApp);
        });

        it("Просроченный access token, валидный refresh, удачный сценарий перевыпуска", async function() {
            let response = await supertestServ(expressApp)
                .post("/auth/refresh-token")
                .set("Content-Type", "application/json")
                .set({ Authorization: `Bearer ${accessToken}` })
                .send({ refreshToken: refreshToken })

            expect(response.statusCode).to.be.equal(201);

            expect(response.body).not.to.be.empty;
            expect(response.body.accessToken,"Отсутствует новый access token").to.not.null;
            expect(response.body.accessToken, "Ожидали access токен в виде строки").to.be.string;
            expect(response.body.refreshToken, "Отсутствует refresh token").to.not.null;
            expect(response.body.refreshToken, "Ожидали refresh token в виде строки").to.be.string;
            expect(response.body.refreshToken, "Новый refresh токен не отличается от старого").to.not.equal(refreshToken);
            
            let mockedServiсe = builder.Data.userService.proxy;
            verify(mockedServiсe.updateUserRefreshToken(userId, anyString())).once();
        })
    });

    context("Logout", function (){
        let userId = 562;
        let { accessToken } = CryptoHelper.getTokens({userId: userId, permissionFlag: 1}, 
                                                      "name@email.domain",
                                                      builder.Data.jwtSecret,
                                                      600);

        before(async function(){
            manualResetTestInstances();
            builder
                //.addStep(data => data.usersStub.addMock(user => when))
                .addStep(data => data.userService.addMock(service => when(service.getUserById(userId)).thenResolve(data.usersStub.Instance))
                                                 .addMock(service => when(service.getRefreshTokenByUserId(userId)).thenResolve(data.refreshTokenStub.Instance)))
                .TestedInstance.registerRoutes(expressApp);
        });

        it("Удачный сценарий", async function() {
            await supertestServ(expressApp)
                .post("/auth/logout")
                .set("Content-Type", "application/json")
                .set({ Authorization: `Bearer ${accessToken}` })
                .send()
                .expect(200);

            let mockedServiсe = builder.Data.userService.proxy;
            verify(mockedServiсe.revokeUserRefreshToken(userId)).once();
        });
    });
});
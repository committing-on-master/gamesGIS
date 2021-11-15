import { anyString, anything, mock, when, verify, capture } from "ts-mockito";
import winston from "winston";
import express from "express";
import supertestServ from "supertest";
import { expect } from "chai";

import { Brick } from "./../../helpers/brick";
import { TestDataBuilder } from "./../../helpers/test.data.builder";

import { UsersRoutes } from "./../../../src/controllers/users/users.routes.config";
import { UsersMiddleware } from "./../../../src/controllers/users/users.middleware";
import { UsersController } from "./../../../src/controllers/users/users.controller";
import { PermissionMiddleware } from "./../../../src/controllers/permission.middleware";
import { ServicesLayer } from "./../../../src/services-layer/services.layer";
import { UsersService } from "./../../../src/services-layer/users/users.service";
import { CryptoHelper } from "./../../helpers/crypto.helper";
import { UsersDAO } from "./../../../src/data-layer/models/users.dao";
import { AuthMiddleware } from "./../../../src/controllers/auth/auth.middleware";

class TestData {
    logger = new Brick(mock<winston.Logger>());
    serviceLayer = new Brick(mock(ServicesLayer));
    userService = new Brick(mock(UsersService));
    usersStub = new Brick(mock(UsersDAO));
    // refreshTokenStub = new Brick(mock(RefreshTokensDao));

    jwtSecret: string = "S#cReT$tr1ng";
    // jwtExpiration: number = 60;
}

class UserTestDataBuilder extends TestDataBuilder<TestData, UsersRoutes> {
    private usersMiddleware?: UsersMiddleware;
    private usersController?: UsersController;
    private permissionMiddleware?: PermissionMiddleware;
    private authMiddleware?: AuthMiddleware;

    constructor() {
        super(new TestData());
    }
    reset(): void {
        this.Data.logger.reset();
        // this.data.logger.addMock(logger => when(logger.info(anyString())).thenCall((str) => console.log(str)));
        
        this.Data.serviceLayer.reset();
        this.Data.userService.reset();
    }
    get TestedInstance(): UsersRoutes {
        this.Data.serviceLayer.addMock(layer => when(layer.usersService).thenReturn(this.Data.userService.Instance));

        this.usersMiddleware = new UsersMiddleware(this.Data.logger.Instance,
                                                   this.Data.serviceLayer.Instance);
        this.usersController = new UsersController(this.Data.logger.Instance,
                                                   this.Data.serviceLayer.Instance);
        this.permissionMiddleware = new PermissionMiddleware(this.Data.logger.Instance);
        this.authMiddleware = new AuthMiddleware(this.Data.logger.Instance,
                                                 this.Data.jwtSecret,
                                                 this.Data.serviceLayer.Instance);

        this.testedInstance = new UsersRoutes(this.Data.logger.Instance,
                                              this.usersMiddleware,
                                              this.permissionMiddleware,
                                              this.authMiddleware,
                                              this.usersController,
                                              this.Data.userService.Instance);
        return this.testedInstance;
    }
}

describe("Проверка работы допусков при работе UserController-а", function(){
    const builder = new UserTestDataBuilder();
    let expressApp: express.Application;

    /**
     * Игрался с beforeEach, проиграл. За сим, дергаем руками в каждом тесте
     */
    function manualResetTestInstances() {
        builder.reset();
        expressApp = express();
        expressApp.use(express.json());
    };

    context("Группа тестов на валидацию схемы полей регистрации пользователя", function() {
        before(function() {
            manualResetTestInstances();
            builder.TestedInstance.registerRoutes(expressApp);
        })
        const requestsBody: {msg: string, body: string, expected: {code: number, problemField: string }}[] = [
            {
                msg: "Отсутствует поле пароля",
                body: JSON.stringify({ email: "marcos.henrique@toptal.com", name: "Leha"}),
                expected: {code: 400, problemField: "password" } 
            },
            {
                msg: "email задан в неверном формате - без собаки",
                body: JSON.stringify({ email: "marcos.henriquetoptal.com", name: "Leha", password: "LehaWarrior2008"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "email задан в неверном формате - без домена верхнего уровня",
                body: JSON.stringify({ email: "marcos.henriquetop@talcom", name: "Leha", password: "LehaWarrior2008"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "email задан в неверном формате - без ящика",
                body: JSON.stringify({ email: "@toptal.com", name: "Leha", password: "LehaWarrior2008"}),
                expected: {code: 400, problemField: "email" } 
            },
            {
                msg: "Пароль слишком короткий < 5",
                body: JSON.stringify({ password: "Five5", name: "Leha", email: "gachi@tarkov.com"}),
                expected: {code: 400, problemField: "password" } 
            },
            {
                msg: "Пароль слишком длинный > 16",
                body: JSON.stringify({ password: "12345678901234567", name: "Leha", email: "gachi@tarkov.com"}),
                expected: {code: 400, problemField: "password" } 
            },
            {
                msg: "Имя пользователя не задано",
                body: JSON.stringify({ password: "TheWarrior2008", email: "gachi@tarkov.com"}),
                expected: {code: 400, problemField: "name" } 
            },
            {
                msg: "Имя пользователя короткое",
                body: JSON.stringify({ name: "PW",  password: "TheWarrior2008", email: "gachi@tarkov.com"}),
                expected: {code: 400, problemField: "name" } 
            },
            {
                msg: "Имя пользователя длинное",
                body: JSON.stringify({ name: "TheWarriorWithTheLongestArm",  password: "TheWarrior2008", email: "gachi@tarkov.com"}),
                expected: {code: 400, problemField: "name" } 
            }
        ];

        requestsBody.forEach(function(testCase) {
            it(testCase.msg, async function() {
                let response = await supertestServ(expressApp)
                    .post('/users')
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

    context("Регистрация пользователя", function() {
        const userEmail = "user@mail.ru"
        const userPassword = "SomeUserPassword";
        const userName = "Duude";
        before(function() {
            manualResetTestInstances();
            builder
            .addStep(data => data.userService.addMock(service => when(service.isEmailAvailable(userEmail)).thenResolve(true))
                                             .addMock(service => when(service.isNameAvailable(userName)).thenResolve(true)))
            .TestedInstance.registerRoutes(expressApp);
        })

        it("Сценарий удачной регистрации", async function() {
            await supertestServ(expressApp)
                .post("/users")
                .set("Content-Type", "application/json")
                .send({email: userEmail, password: userPassword, name: userName})
                .expect(201);
            
            let mockedService = builder.Data.userService.proxy;
            verify(mockedService.createUser(anything())).once();
            let userData = capture(mockedService.createUser).first()[0];

            expect(userData.email).to.be.equal(userEmail);
            expect(userData.name).to.be.equal(userName);
            expect(userData.password).to.be.equal(userPassword);
        })
    });

    context("Получение данных пользователя", function() {
        const userId = 134;
        const userEmail = "gachi@tarkov.gay";
        const jwtSecret = builder.Data.jwtSecret;
        const { accessToken } = CryptoHelper.getTokens({userId: userId, permissionFlag: 1},
                                                        userEmail,
                                                        jwtSecret,
                                                        60)
        before(function() {
            manualResetTestInstances();
            builder
            .addStep(data => data.usersStub.addMock(user => when(user.id).thenReturn(userId))
                                           .addMock(user => when(user.email).thenReturn(userEmail)))
            .addStep(data => data.userService.addMock(service => when(service.getUserById(userId)).thenResolve(data.usersStub.Instance)))
            .TestedInstance.registerRoutes(expressApp);
        })
        it("Удачный сценарий получения данных", async function() {
            let response = await supertestServ(expressApp)
                .get(`/users/${userId}`)
                .set("Content-Type", "application/json")
                .set({ Authorization: `Bearer ${accessToken}` })
                .expect(200);

            expect(response.body.user).is.not.null;
            expect(response.body.user.email).is.equal(userEmail);
        })
    })

    context.skip("Сценарий редактирования пользовательских данных", function() {
        const userId = 134;
        const userEmail = "gachi@tarkov.gay";
        const jwtSecret = builder.Data.jwtSecret;
        const { accessToken } = CryptoHelper.getTokens({userId: userId, permissionFlag: 1},
                                                        userEmail,
                                                        jwtSecret,
                                                        60)
        before(function() {
            manualResetTestInstances();
            builder
            // .addStep(data => data.userService.addMock(service => when(service.checkUserDataAvailability(anything())).thenResolve([])))
            .TestedInstance.registerRoutes(expressApp);
        })

        it("Смена имени", async function() {
            let response = await supertestServ(expressApp)
                .post("/users/234")
                .set("Content-Type", "application/json")
                .send({name: "newName"})
                .expect(201);
        })
    }) 
    
    // context.only("custom", function(){
    //     it("", function(done){


    //         let func = (param: number | number[]) => {
    //             let result: number[] = [];

    //             if (Array.isArray(param)) {
    //                 result.push(...param);
    //             } else {
    //                 result.push(param);
    //             }

    //             result.forEach(item => console.log(item));
    //         }

    //         console.log("Одиночный принт");
    //         func(42);

    //         console.log("Множественный из массива");
    //         func([1,2,3,4,5,6,7]);


    //         done();
    //     })
    // })
});
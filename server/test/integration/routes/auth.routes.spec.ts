import "reflect-metadata";
import chai, { expect } from "chai";
import express from "express";
import supertestServ from "supertest";
import { AuthController } from "../../../src/controllers/auth/auth.controller";
import { AuthMiddleware } from "../../../src/controllers/auth/auth.middleware";
import { AuthRoutes } from "../../../src/controllers/auth/auth.routes.config";
import { ServicesLayer } from "../../../src/services-layer/services.layer";
import { UsersService } from "../../../src/services-layer/users/users.service";
import { anyString, instance, mock, reset, when } from "ts-mockito";
import winston from "winston";

let assert = chai.assert;
const should = chai.should();

describe("Сценарии создания JWT токена",function(){
    const loggerMock = mock<winston.Logger>()
    when(loggerMock.info(anyString())).thenCall((str) => console.log(str));
    const loggerStub: winston.Logger = instance(loggerMock);

    const jwtSecret: string = "SomeText228";
    const jwtExpiration: number = 60;
    
    const mockedUserService = mock(UsersService);
    const userService: UsersService = instance(mockedUserService);
    
    const mockedServiceLayer = mock(ServicesLayer);
    when(mockedServiceLayer.usersService).thenReturn(userService);
    const serviceLayer: ServicesLayer = instance(mockedServiceLayer);

    const authMiddleware = new AuthMiddleware(loggerStub, jwtSecret, serviceLayer);
    const authController = new AuthController(loggerStub, jwtSecret, jwtExpiration);

    const testInstance: AuthRoutes = new AuthRoutes(loggerStub, authController, authMiddleware);

    let expressApp: express.Application;
    beforeEach(function() {
        reset(mockedUserService);
        expressApp = express();
        expressApp.use(express.json());
        expressApp = testInstance.registerRoutes(expressApp);
    })

    context("Группа тестов на валидацию схемы полей генерации нового токена", function() {
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
                    
                expect(response.statusCode).equal(testCase.expected.code);
                expect(response.body).have.property("errors");                
                expect(
                    (response.body.errors as Array<{param: string}>).some((item) => item.param === testCase.expected.problemField))
                    .to.be.true;
                    
            })
        });
    })
});
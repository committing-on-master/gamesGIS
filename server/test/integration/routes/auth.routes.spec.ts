import "reflect-metadata";
import chai from "chai";
import express from "express";
import supertestServ from "supertest";
import { AuthController } from "../../../src/controllers/auth/auth.controller";
import { AuthMiddleware } from "../../../src/controllers/auth/auth.middleware";
import { AuthRoutes } from "../../../src/controllers/auth/auth.routes.config";
import { ServicesLayer } from "../../../src/services-layer/services.layer";
import { UsersService } from "../../../src/services-layer/users/users.service";
import { anyNumber, anything, instance, mock, when } from "ts-mockito";
import winston from "winston";

let assert = chai.assert;
let should = chai.should();

describe("Сценарий создания JWT токена для зарегистрированного пользователя",function(){
    const loggerStub: winston.Logger = instance(mock<winston.Logger>());
    const jwtSecret: string = "SomeText228";
    const jwtExpiration: number = 60;

    beforeEach(function() {})

    it("просто тест", function(done) {

        const userServiceTemplate: UsersService = mock(UsersService);
        when(userServiceTemplate.deleteById(anyNumber())).thenCall(() => console.log("Дернули удаляшку на заглушке."));
        const userServiceStub: UsersService = instance(userServiceTemplate);
    
        const serviceLayerTemplate: ServicesLayer = mock(ServicesLayer);
        when(serviceLayerTemplate.usersService).thenReturn(userServiceStub);
        const serviceLayerStub: ServicesLayer = instance(serviceLayerTemplate);
        
        serviceLayerStub.usersService.deleteById(33);

        let authMiddleware = new AuthMiddleware(loggerStub, jwtSecret, serviceLayerStub);
        let authController = new AuthController(loggerStub, jwtSecret, jwtExpiration);
        let testInstance: AuthRoutes = new AuthRoutes(loggerStub, authController, authMiddleware);

        let expressApp: express.Application = express();
        expressApp = testInstance.registerRoutes(expressApp);

        supertestServ(expressApp)
            .post('/auth')
            .set("Content-Type", "application/json")
            .send({
                email: "marcos.henrique@toptal.com",
                password: "sup3rS3cr3tPassw0rd!23"
            })
            .expect(400, done);
    });
});


// describe('the trimTodoName function', function () {
    // it('should return 3', function () {
    //     testingInstance.returnThreeIfNotOdd(1).should.equal(3);
    // });
    // it('should return 4', function () {
    //     testingInstance.returnThreeIfNotOdd(4).should.equal(4)
    // });
    // it('should return 16', function () {
    //     assert(testingInstance.returnThreeIfNotOdd(16) === 16, "Живем пацаны!");
    // });
// });

// describe("using mock framework", function() {
//     let testSomething: NumberReturner = mock(NumberReturner);
//     when(testSomething.returnThreeIfNotOdd(anything())).thenReturn(3);
//     when(testSomething.returnThreeIfNotOdd(66)).thenReturn(69);

//     let testInstance: NumberReturner = instance(testSomething);

//     console.log(testInstance.returnThreeIfNotOdd(66));
//     console.log(testInstance.returnThreeIfNotOdd(65));
// });
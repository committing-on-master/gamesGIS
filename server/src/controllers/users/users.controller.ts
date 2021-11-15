import express from "express";
import { inject, injectable } from "tsyringe";
import winston from "winston";

import { ServicesLayer } from "./../../services-layer/services.layer";
import { CommonController } from "./../common.controller";
import { TokenInjection } from "./../../infrastructure/token.injection";
import { UsersDAO } from "./../../data-layer/models/users.dao";
import { GetUserDto } from "./../../services-layer/users/models/get.user.dto";

@injectable()
class UsersController extends CommonController {
    readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "UsersController");
        this.services = services;

        // методы уходят в endpoint-ы экспресса, биндим this
        this.listUsers = this.listUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.patchUser = this.patchUser.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }

    private formatErrors(req: express.Request, errors: {prop: string, msg:string}[]) {
        let result: {value: string, msg: string, param: string, location:string}[] = [];
        errors.forEach(error => {
            result.push({
                location: "body",
                msg: error.msg,
                param: error.prop,
                value: req.body[error.prop]                            
            });
        });
        
        return result;
    }

    public async createUser(req: express.Request, res: express.Response) {
        try {
            await this.services.usersService.createUser(req.body);
            res.status(201).send({ msg: "user registered" });
        } catch (error) {
            this.logger.error(`${this.name}.createUser error`, error);
            return res.status(500).send();
        }
    }

    public async getUserById(req: express.Request, res: express.Response) {
        try {
            let user: UsersDAO = res.locals.user;
            let responseData: GetUserDto = {
                email: user.email,
                name: user.name,
                permissionFlag: user.permissionFlag,
                registrationDate: user.registrationDate
            }
            res.status(200).send({user: responseData});
        } catch (error) {
            this.logger.error(`${this.name}.getUserById`, error);
            return res.status(500).send();
        }
    }

    /**
     * endpoint по обновлению данных пользователя
     */
    async patchUser(req: express.Request, res: express.Response) {
        try {
            let errorMsgs = await this.services.usersService.checkUserDataAvailability(req.body);
            if (errorMsgs.length !== 0) {
                let formatted = this.formatErrors(req, errorMsgs);
                return res.status(409).json({ errors: formatted });
            }
            
            await this.services.usersService.updateUserById(req.body.id, req.body);
            res.status(200).send({ msg: "user data updates successfully" });
        } catch (error) {
            this.logger.error('UsersController.patchUser error', error);
            return res.status(500).send();
        }
    }

    // TODO: удолить после тестов
    async listUsers(req: express.Request, res: express.Response) {
        const users = await this.services.usersService.list(100, 0);
        res.status(200).send(users);
    }



    async removeUser(req: express.Request, res: express.Response) {
        await this.services.usersService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export { UsersController };
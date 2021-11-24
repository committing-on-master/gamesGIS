import express from "express";
import { inject, injectable } from "tsyringe";
import winston from "winston";

import { ServicesLayer } from "./../../services-layer/services.layer";
import { CommonController } from "./../common.controller";
import { TokenInjection } from "./../../infrastructure/token.injection";
import { GetUserDto } from "./../../services-layer/users/models/get.user.dto";
import { GetAgreementDto } from "./../../services-layer/agreements/models/get.agreement.dto";

@injectable()
class UsersController extends CommonController {
    readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "UsersController");
        this.services = services;

        // методы уходят в endpoint-ы экспресса, биндим this
        this.listUsers = this.listUsers.bind(this);
        this.createUser = this.createUser.bind(this);
        this.patchUser = this.patchUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.changeUserPermission = this.changeUserPermission.bind(this);
    }

    /**endpoint по созданию пользователя*/
    public async createUser(req: express.Request, res: express.Response) {
        try {
            await this.services.Users.createUser(req.body);
            return res.status(201).send({ msg: "user registered" });
        } catch (error) {
            this.logger.error(`${this.name}.createUser error`, error);
            return res.status(500).send({});
        }
    }

    /**endpoint получения данных пользователя */
    public async getUser(req: express.Request, res: express.Response) {
        try {
            let user = await this.services.Users.getUserById(res.locals.userId);
            if (!user) {
                return res.status(404).send({error: `User ${req.params.userId} not found`});
            }
            let responseData: GetUserDto = {
                email: user.email,
                name: user.name,
                permissionFlag: user.permissionFlag,
                registrationDate: user.registrationDate
            }
            res.status(200).send({user: responseData});
        } catch (error) {
            this.logger.error(`${this.name}.getUserById`, error);
            return res.status(500).send({});
        }
    }

    /**
     * endpoint по обновлению данных пользователя
     */
    public async patchUser(req: express.Request, res: express.Response) {
        try {
            await this.services.Users.updateUserById(res.locals.userId, req.body);
            return res.status(200).send({ msg: "user data updates successfully" });
        } catch (error) {
            this.logger.error(`${this.name}.patchUser`, error);
            return res.status(500).send({});
        }
    }
    public async changeUserPermission(req: express.Request, res: express.Response) {
        try {
            const targetUser: number = res.locals.userId;
            const newPermission: number = res.locals.permissionFlag;
            await this.services.Users.updateUserPermission(targetUser, newPermission);
            return res.status(200).send({ msg: "user permission successfully changed" });
        } catch (error) {
            this.logger.error(`${this.name}.changeUserPermission`, error);
            return res.status(500).send({});
        }
    }

    // TODO: удолить после тестов
    async listUsers(req: express.Request, res: express.Response) {
        const users = await this.services.Users.list(100, 0);
        res.status(200).send(users);
    }
}

export { UsersController };
import express from "express";
import {inject, injectable} from "tsyringe";
import winston from "winston";
import httpError from "http-errors";

import {ServicesLayer} from "./../../services-layer/services.layer";
import {CommonController} from "./../common.controller";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {GetUserDto} from "../../dto/response/get.user.dto";

@injectable()
class UsersController extends CommonController {
    readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, services: ServicesLayer) {
        super(logger, "UsersController");
        this.services = services;

        // методы уходят в endpoint-ы экспресса, биндим this
        this.createUser = this.createUser.bind(this);
        this.patchUser = this.patchUser.bind(this);
        this.getUser = this.getUser.bind(this);
        this.changeUserPermission = this.changeUserPermission.bind(this);
    }

    /**
     * endpoint по созданию пользователя
     * @param {express.Request} req
     * @param {express.Response} res
     * @return {void}
     * */
    public async createUser(req: express.Request, res: express.Response) {
        await this.services.Users.createUser(req.body);
        return res.status(201).json({message: "user registered"});
    }

    /**
     * endpoint получения данных пользователя
     * @param {express.Request} req
     * @param {express.Response} res
     * @return {void}
     * */
    public async getUser(req: express.Request, res: express.Response) {
        const user = await this.services.Users.getUserById(res.locals.userId);
        if (!user) {
            throw new httpError.NotFound(`User ${req.params.userId} not found`);
        }
        const responseData: GetUserDto = {
            email: user.email,
            name: user.name,
            permissionFlag: user.permissionFlag,
            registrationDate: user.registrationDate,
        };
        res.status(200).send({user: responseData});
    }

    /**
     * endpoint по обновлению данных пользователя
     * @param {express.Request} req
     * @param {express.Response} res
     * @return {void}
     */
    public async patchUser(req: express.Request, res: express.Response) {
        await this.services.Users.updateUserById(res.locals.userId, req.body);
        return res.status(200).send({msg: "user data updates successfully"});
    }
    public async changeUserPermission(req: express.Request, res: express.Response) {
        const targetUser: number = res.locals.userId;
        const newPermission: number = res.locals.permissionFlag;
        await this.services.Users.updateUserPermission(targetUser, newPermission);
        return res.status(200).send({msg: "user permission successfully changed"});
    }
}

export {UsersController};

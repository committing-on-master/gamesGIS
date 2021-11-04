// we import express to add types to the request/response objects from our controller functions
import express from "express";

// we import the argon2 library for password hashing
import argon2 from 'argon2';

// we use debug with a custom context as described in Part 1
import { ServicesLayer } from "../../services-layer/services.layer";
import { injectable } from "tsyringe";

@injectable()
class UsersController {
    readonly services: ServicesLayer;

    constructor(services: ServicesLayer) {
        this.services = services;

        // методы уходят в endpoint-ы экспресса, биндим this
        this.listUsers = this.listUsers.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.createUser = this.createUser.bind(this);
        this.patch = this.patch.bind(this);
        this.put = this.put.bind(this);
        this.removeUser = this.removeUser.bind(this);
    }
    
    async listUsers(req: express.Request, res: express.Response) {
        const users = await this.services.usersService.list(100, 0);
        res.status(200).send(users);
    }

    async getUserById(req: express.Request, res: express.Response) {
        const user = await this.services.usersService.readById(req.body.id);
        res.status(200).send(user);
    }

    async createUser(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        const userId = await this.services.usersService.create(req.body);
        res.status(201).send({ id: userId });
    }

    async patch(req: express.Request, res: express.Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        await this.services.usersService.patchById(req.body.id, req.body);
        res.status(204).send();
    }

    async put(req: express.Request, res: express.Response) {
        req.body.password = await argon2.hash(req.body.password);
        await this.services.usersService.putById(req.body.id, req.body);
        res.status(204).send();
    }

    async removeUser(req: express.Request, res: express.Response) {
        await this.services.usersService.deleteById(req.body.id);
        res.status(204).send();
    }
}

export { UsersController };
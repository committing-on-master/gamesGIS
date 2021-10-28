import {CommonRoutesConfig} from "../common/common.routes.config";

import express, { response } from "express";

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "UsersRoutes");
    }
    configureRoutes(): express.Application {
        this.app.route("/users")
            .get((request: express.Request, response: express.Response) => {
                response.status(200).send("List of users");
            })
            
            .post((request: express.Request, response: express.Response) => {
                response.status(200).send("Post to users");
            });

        this.app.route("/users/:userId")
            .all((request: express.Request, response: express.Response, next: express.NextFunction) => {
                // this middleware function runs before any request to /users/:userId
                // but it doesn't accomplish anything just yet---
                // it simply passes control to the next applicable function below using next()
                // Вот этой шляпы я не понял, как она перепрыгнет то дальше, а не внутрь.
                // Только если некстом будет мидлваря, которая до ответов должна отработать
                next();
            })
            .get((request: express.Request, response: express.Response) => {
                response.status(200).send(`GET requested for id ${request.params.userId}`);
            })
            .put((request: express.Request, response: express.Response) => {
                response.status(200).send(`PUT requested for id ${request.params.userId}`);
            })
            .patch((request: express.Request, response: express.Response) => {
                response.status(200).send(`PATCH requested for id ${request.params.userId}`);
            })
            .delete((request: express.Request, response: express.Response) => {
                response.status(200).send(`DELETE requested for id ${request.params.userId}`);
            })


        return this.app;
    }
}
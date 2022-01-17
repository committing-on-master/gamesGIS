import {Router} from "express";
import {TokenInjection} from "./../../infrastructure/token.injection";
import {PermissionFlag} from "./../../services-layer/users/models/permission.flag";
import {inject, injectable} from "tsyringe";
import winston from "winston";
import {AuthMiddleware} from "../auth/auth.middleware";
import {CommonRoutesConfig} from "../common.routes.config";
import {PermissionMiddleware} from "../permission.middleware";
import {MapProfileController} from "./map.profile.controller";
import {MapProfileMiddleware} from "./map.profile.middleware";
import {asyncWrapper} from "../asyncHandler";
import {asyncMapProfileValidation} from "./models.schema/async.map.profile.validation";
import {ServicesLayer} from "./../../services-layer/services.layer";

@injectable()
class MapProfileRoutes extends CommonRoutesConfig {
    private readonly mapProfileMiddleware: MapProfileMiddleware;
    private readonly mapProfileController: MapProfileController;
    private readonly permissionMiddleware: PermissionMiddleware;
    private readonly authMiddleware: AuthMiddleware;
    private readonly services: ServicesLayer;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
        mapProfileMiddleware: MapProfileMiddleware,
        permissionMiddleware: PermissionMiddleware,
        mapProfileController: MapProfileController,
        authMiddleware: AuthMiddleware,
        services: ServicesLayer) {
        super(logger, "MapProfileRoutes");

        this.mapProfileController = mapProfileController;
        this.permissionMiddleware = permissionMiddleware;
        this.mapProfileMiddleware = mapProfileMiddleware;
        this.authMiddleware = authMiddleware;
        this.services = services;
    }

    protected configureRoute(route: Router): Router {
        route
            .param("profileName", this.mapProfileMiddleware.extractParamToBody);

        route
            .route("/map-profile/:profileName")
            .get(asyncWrapper(this.mapProfileController.getProfile))
            .post(
                this.authMiddleware.jwtTokenValidation(),
                this.permissionMiddleware.permissionFlagRequired(PermissionFlag.APPROVED_USER),
                asyncWrapper(this.mapProfileMiddleware.validateRequestSchema(asyncMapProfileValidation(this.services.MapProfiles))),
                asyncWrapper(this.mapProfileController.createProfile),
            );

        route.use(this.mapProfileMiddleware.handleOperationalErrors);
        return route;
    }
}

export {MapProfileRoutes};

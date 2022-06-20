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
import {markerDtoSchema} from "./models.schema/marker.dto.schema";
import {checkSchema} from "express-validator";

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
            .route("/map-profiles")
            .get(asyncWrapper(this.mapProfileController.getProfiles))
            .post(
                this.authMiddleware.jwtTokenValidation(),
                this.permissionMiddleware.permissionFlagRequired(PermissionFlag.APPROVED_USER),
                asyncWrapper(this.mapProfileMiddleware.validateRequestSchema(asyncMapProfileValidation(this.services.MapProfiles))),
                asyncWrapper(this.mapProfileController.createProfile),
            );

        route
            .get("/map-profiles/review", asyncWrapper(this.mapProfileController.getReviewProfiles));

        route
            .param("profileCount", this.mapProfileMiddleware.extractParamToBody);
        route
            .get("/map-profiles/most-popular/:profileCount", asyncWrapper(this.mapProfileController.getTopProfiles));

        route
            .param("profileId", this.mapProfileMiddleware.extractParamToBody);
        route
            .route("/map-profiles/:profileId")
            .all(
                this.authMiddleware.jwtTokenValidation(),
                asyncWrapper(this.mapProfileMiddleware.validateProfileIdAuthorship),
            )
            .put(asyncWrapper(this.mapProfileController.updateMapProfile))
            .delete(asyncWrapper(this.mapProfileController.deleteMapProfile));

        route
            .param("profileName", this.mapProfileMiddleware.extractParamToBody);
        route
            .route("/map-profiles/:profileName/markers")
            .get(asyncWrapper(this.mapProfileController.getMarkers))
            .post(
                this.authMiddleware.jwtTokenValidation(),
                this.permissionMiddleware.permissionFlagRequired(PermissionFlag.APPROVED_USER),
                asyncWrapper(this.mapProfileMiddleware.validateProfileNameAuthorship),
                asyncWrapper(this.mapProfileMiddleware.validateRequestSchema(checkSchema(markerDtoSchema))),
                asyncWrapper(this.mapProfileController.createMarker),
            );

        route
            .param("markerId", this.mapProfileMiddleware.extractParamToBody);
        route
            .route("/map-profiles/:profileName/markers/:markerId")
            .all(
                this.authMiddleware.jwtTokenValidation(),
                this.permissionMiddleware.permissionFlagRequired(PermissionFlag.APPROVED_USER),
                asyncWrapper(this.mapProfileMiddleware.validateProfileNameAuthorship),
            )
            .delete(asyncWrapper(this.mapProfileController.deleteMarker))
            .put(
                asyncWrapper(this.mapProfileMiddleware.validateRequestSchema(checkSchema(markerDtoSchema))),
                asyncWrapper(this.mapProfileController.updateMarker),
            );

        route.use(this.mapProfileMiddleware.handleOperationalErrors);
        return route;
    }
}

export {MapProfileRoutes};

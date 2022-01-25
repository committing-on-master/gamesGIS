import {inject, singleton} from "tsyringe";
import {Connection} from "typeorm";
import winston from "winston";

import {UsersRepository} from "./repositories/users.repository";
import {TokenInjection} from "../infrastructure/token.injection";
import {RefreshTokensRepository} from "./repositories/refresh.tokens.repository";
import {AgreementsRepository} from "./repositories/agreements.repository";
import {CoordinatesRepository} from "./repositories/coordinates.repository";
import {GalleryRepository} from "./repositories/gallery.repository";
import {MapProfileRepository} from "./repositories/map.profile.repository";
import {MarkerRepository} from "./repositories/marker.repository";
import {MapRepository} from "./repositories/map.repository";

@singleton()
class DataLayer {
    readonly dbContext: Connection;
    readonly logger: winston.Logger;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, dbContext: Connection) {
        this.logger = logger;
        this.logger.info("Creating DataLayer");
        this.dbContext = dbContext;
    }

    public get usersRepository(): UsersRepository {
        return this.dbContext.getCustomRepository(UsersRepository);
    }

    public get refreshTokensRepository(): RefreshTokensRepository {
        return this.dbContext.getCustomRepository(RefreshTokensRepository);
    }

    public get agreementsRepository(): AgreementsRepository {
        return this.dbContext.getCustomRepository(AgreementsRepository);
    }

    public get coordinatesRepository(): CoordinatesRepository {
        return this.dbContext.getCustomRepository(CoordinatesRepository);
    }

    public get galleyRepository(): GalleryRepository {
        return this.dbContext.getCustomRepository(GalleryRepository);
    }

    public get mapProfileRepository(): MapProfileRepository {
        return this.dbContext.getCustomRepository(MapProfileRepository);
    }

    public get markerRepository(): MarkerRepository {
        return this.dbContext.getCustomRepository(MarkerRepository);
    }

    public get mapRepository(): MapRepository {
        return this.dbContext.getCustomRepository(MapRepository);
    }

    public get ContextManager() {
        return this.dbContext.manager;
    }
}

export {DataLayer};

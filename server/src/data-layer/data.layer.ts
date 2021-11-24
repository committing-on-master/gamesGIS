import { inject, singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import winston from 'winston';

import { UsersRepository } from './repositories/users.repository';
import { TokenInjection } from '../infrastructure/token.injection';
import { RefreshTokensRepository } from './repositories/refresh.tokens.repository';
import { AgreementsRepository } from './repositories/agreements.repository';

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
    
}

export { DataLayer }
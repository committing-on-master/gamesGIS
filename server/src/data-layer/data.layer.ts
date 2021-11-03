import { TokenInjection } from '../infrastructure/token.injection';
import { inject, singleton } from 'tsyringe';
import { Connection } from 'typeorm';
import winston from 'winston';
import { UsersRepository } from './repositories/users.repository';

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
}

export { DataLayer }
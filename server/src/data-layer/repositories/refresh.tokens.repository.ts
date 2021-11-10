import { AbstractRepository, EntityRepository } from "typeorm";
import { RefreshTokensDao } from "../models/refresh.tokens.dao";

@EntityRepository(RefreshTokensDao)
class RefreshTokensRepository extends AbstractRepository<RefreshTokensDao> {
    /**
     * Поиск записи refresh токена по идентификатору пользователя
     * @param userId идентификатор пользователя
     * @returns найденная запись или undefined в случае её отсутствия в базе
     */
    public async findTokenByUserId(userId: number): Promise<RefreshTokensDao | undefined> {
        return await this.repository.findOne({where: {user: {id: userId}}});
    }

    public async addToken(token: RefreshTokensDao): Promise<RefreshTokensDao> {
        return await this.repository.save(token);
    }

    public async updateToken(token: RefreshTokensDao): Promise<void> {
        await this.repository.update(token.id, token);
    }
}

export { RefreshTokensRepository }
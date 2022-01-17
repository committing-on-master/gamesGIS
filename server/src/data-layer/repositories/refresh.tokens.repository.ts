import {nameofPropChecker} from "./../../infrastructure/name.of.prop.checker";
import {AbstractRepository, EntityRepository, FindOneOptions} from "typeorm";
import {RefreshTokensDao} from "./../models/refresh.tokens.dao";

// eslint-disable-next-line new-cap
@EntityRepository(RefreshTokensDao)
class RefreshTokensRepository extends AbstractRepository<RefreshTokensDao> {
    /**
     * Поиск записи refresh токена по идентификатору пользователя
     * @param {number} userId идентификатор пользователя
     * @return {Promise<RefreshTokensDao | undefined>} найденная запись или undefined в случае её отсутствия в базе
     */
    public async findTokenByUserId(userId: number): Promise<RefreshTokensDao | undefined> {
        return this.repository.findOne({where: {user: {id: userId}}});
    }

    public async getRefreshToken(token: string, relation: boolean = false) {
        const options: FindOneOptions = {
            where: {token: token},
            ...(relation && {relations: [nameofPropChecker<RefreshTokensDao>("user")]}),
        };
        return this.repository.findOne(options);
    }

    public async addToken(token: RefreshTokensDao): Promise<RefreshTokensDao> {
        return this.repository.save(token);
    }

    public async updateToken(token: RefreshTokensDao): Promise<void> {
        await this.repository.update(token.id, token);
    }
}

export {RefreshTokensRepository};

import {EntityRepository, AbstractRepository} from "typeorm";
import {UsersDAO} from "../models/users.dao";

// eslint-disable-next-line new-cap
@EntityRepository(UsersDAO)
class UsersRepository extends AbstractRepository<UsersDAO> {
    /**
     * Сохраняет пользователя вв базе данных
     * @param {UsersDAO} user объект содержащий поля для сохранения
     * @return {Promise<UsersDAO>} сохраненная сущность, с присвоенным идентификатором
     */
    public async addUser(user: UsersDAO): Promise<UsersDAO> {
        return this.repository.save(user);
    }

    public async isEmailAlreadyExist(checkingEmail: string): Promise<boolean> {
        // TODO: переделать на SELECT 1, экранировав строку в параметре
        return await this.repository.findOne({where: {email: checkingEmail}}) ? true : false;
    }

    public async isNameAlreadyExist(checkingName: string): Promise<boolean> {
        // TODO: переделать на SELECT 1, экранировав строку в параметре
        return await this.repository.findOne({where: {name: checkingName}}) ? true : false;
    }

    public async isUserExist(userId: number): Promise<boolean> {
        // TODO: переделать на SELECT 1, экранировав строку в параметре
        return await this.repository.findOne(userId) ? true : false;
    }

    public async findUserByEmail(usersEmail: string): Promise<UsersDAO | undefined> {
        return this.repository.findOne({where: {email: usersEmail}});
    }

    public async updateUser(userId: number, user: Partial<UsersDAO>): Promise<void> {
        await this.repository.update(userId, user);
    }

    public async findUserById(userId: number) {
        return this.repository.findOne(userId);
    }

    public async removeUserById(userId: number) {
        await this.repository.delete(userId);
    }

    public async getUserByEmail(email: string) {
        return this.repository.findOne({email: email});
    }
}

export {UsersRepository};

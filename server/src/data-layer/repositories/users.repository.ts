import { EntityRepository, AbstractRepository } from "typeorm";
import { UsersDAO } from "../models/users.dao";

@EntityRepository(UsersDAO)
class UsersRepository extends AbstractRepository<UsersDAO> {

    /**
     * Сохраняет пользователя вв базе данных
     * @param user объект содержащий поля для сохранения
     * @returns сохраненная сущность, с присвоенным идентификатором
     */
    public async addUser(user: UsersDAO): Promise<UsersDAO> {
        return await this.repository.save(user);
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
        return await this.repository.findOne({where: {email: usersEmail}})
    }

    public async updateUser(userId: number, user: Partial<UsersDAO>): Promise<void> {
        await this.repository.update(userId, user);
    }
    
    public async findUserById(userId: number) {
        return await this.repository.findOne(userId);
    }

    public async removeUserById(userId: number) {
        await this.repository.delete(userId);
    }

    public async getUserByEmail(email: string) {
        return await this.repository.findOne({email: email});
    }


    public async getUsers() {
        // TODO: выпили эту хуйню после теста
        let result = await this.repository.find();
        return result;
    }
}

export { UsersRepository }
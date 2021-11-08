import { EntityRepository, AbstractRepository } from "typeorm";
import { UsersDB } from "../models/users.db";

@EntityRepository(UsersDB)
class UsersRepository extends AbstractRepository<UsersDB> {

    /**
     * Сохраняет пользователя вв базе данных
     * @param user объект содержащий поля для сохранения
     * @returns сохраненная сущность, с присвоенным идентификатором
     */
    public async addUser(user: UsersDB) {
        return await this.repository.save(user);
    }

    public async isEmailAlreadyExist(checkingEmail: string): Promise<boolean> {
        return await this.repository.findOne({where: {email: checkingEmail}}) ? true : false;
    }

    public async isNameAlreadyExist(checkingName: string): Promise<boolean> {
        return await this.repository.findOne({where: {name: checkingName}}) ? true : false;
    }

    public async isUserExist(userId: number): Promise<boolean> {
        return await this.repository.findOne(userId) ? true : false;
    }

    public async findUserByEmail(usersEmail: string): Promise<UsersDB | undefined> {
        return await this.repository.findOne({where: {email: usersEmail}})
    }

    public async updateUser(userId: number, user: Partial<UsersDB>): Promise<void> {
        await this.repository.update(userId, user);
    }
    

    public async findUserById(userId: number) {
        let result = await this.repository.findOne(userId);
        return result;
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
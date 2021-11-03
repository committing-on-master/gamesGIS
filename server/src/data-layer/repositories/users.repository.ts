import { EntityRepository, AbstractRepository } from "typeorm";
import { UsersDB } from "../models/users.db";

@EntityRepository(UsersDB)
class UsersRepository extends AbstractRepository<UsersDB> {

    async addUser(user: UsersDB) {
        let result = await this.manager.save(user);
        return result.id as number;
    }

    async findUserById(userId: number) {
        let result = await this.repository.findOne(userId);
        return result;
    }

    async removeUserById(userId: number) {
        await this.repository.delete(userId);
    }

    async getUserByEmail(email: string) {
        return await this.repository.findOne({email: email});
    }

    async updateUser(user: UsersDB) {
        if (!user.id) {
            throw new Error("UsersRepository.updateUser; userId is empty");
        }
        return await this.repository.update(user.id, user);
    }

    async getUsers() {
        // TODO: выпили эту хуйню после теста
        let result = await this.repository.find();
        return result;
    }
}

export { UsersRepository }
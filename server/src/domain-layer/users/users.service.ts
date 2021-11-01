import UsersDao from '../../data-layer/users.dao';
import { CreateUserDto } from './models/create.user.dto';
import { PutUserDto } from './models/put.user.dto';
import { PatchUserDto } from './models/patch.user.dto';

class UsersService {
    constructor() {
    }
    async create(resource: CreateUserDto) {
        return UsersDao.addUser(resource);
    }

    async deleteById(id: string) {
        return UsersDao.removeUserById(id);
    }

    async list(limit: number, page: number) {
        return UsersDao.getUsers();
    }

    async patchById(id: string, resource: PatchUserDto) {
        return UsersDao.patchUserById(id, resource);
    }

    async readById(id: string) {
        return UsersDao.getUserById(id);
    }

    async putById(id: string, resource: PutUserDto) {
        return UsersDao.putUserById(id, resource);
    }

    async getUserByEmail(email: string) {
        return UsersDao.getUserByEmail(email);
    }
}

export { UsersService };
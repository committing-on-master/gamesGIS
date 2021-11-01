import { CreateUserDto } from '../domain-layer/users/models/create.user.dto';
import { PatchUserDto } from '../domain-layer/users/models/patch.user.dto';
import { PutUserDto } from '../domain-layer/users/models/put.user.dto';

import { nanoid as nanoId } from "nanoid"

class UsersDao {
    users: Array<CreateUserDto> = [];

    constructor() {}

    async addUser(user: CreateUserDto): Promise<string> {
        user.id = nanoId();
        this.users.push(user);
        return user.id;
    }

    async getUsers(): Promise<Array<CreateUserDto>> {
        return this.users;
    }

    async getUserById(userId: string): Promise<CreateUserDto | undefined> {
        return this.users.find(user => user.id === userId);
    }
    
    async putUserById(userId: string, user: PutUserDto): Promise<string> {
        const objIndex = this.users.findIndex((user: CreateUserDto) =>  user.id === userId);
        if (objIndex === -1) {
            return `user by id:${userId} not found`;
        }
        // TODO: Бага, массив другого типа, будет каст жс-а в райнтайме. Надо переписать, когда реальную базу будешь крутить
        this.users.splice(objIndex, 1, user);
        return `${user.id} updated via put`;
    }

    async patchUserById(userId: string, user: PatchUserDto): Promise<string> {
        const objIndex = this.users.findIndex((user: CreateUserDto) =>  user.id === userId);
        if (objIndex === -1) {
            return `user by id:${userId} not found`;
        }
        let currentUser = this.users[objIndex];
        // TODO: Alarm yebat, бизнеслогика в слое по работе с базой
        const allowedPatchFields = [
            'password',
            'firstName',
            'lastName',
            'permissionLevel',
        ];

        for (let field of allowedPatchFields) {
            if (field in user) {
                // @ts-ignore
                currentUser[field] = user[field];
            }
        }
        this.users.splice(objIndex, 1, currentUser);
        return `${user.id} patched`;
    }

    async removeUserById(userId: string) {
        const objIndex = this.users.findIndex(
            (obj: { id: string }) => obj.id === userId
        );
        this.users.splice(objIndex, 1);
        return `${userId} removed`;
    }

    async getUserByEmail(email: string) {
        const objIndex = this.users.findIndex(
            (obj: { email: string }) => obj.email === email
        );
        let currentUser = this.users[objIndex];
        if (currentUser) {
            return currentUser;
        } else {
            return null;
        }
    }
}

export default new UsersDao();
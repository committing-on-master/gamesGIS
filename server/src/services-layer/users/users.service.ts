import { CreateUserDto } from './models/create.user.dto';
import { PutUserDto } from './models/put.user.dto';
import { PatchUserDto } from './models/patch.user.dto';
import { inject, injectable } from 'tsyringe';
import { DataLayer } from "../../data-layer/data.layer";
import { UsersDB } from "../../data-layer/models/users.db";
import winston from 'winston';
import { TokenInjection } from '../../infrastructure/token.injection';

@injectable()
class UsersService {
    readonly dataLayer: DataLayer;
    readonly logger: winston.Logger;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger, dataLayer: DataLayer) {
        this.logger = logger;
        this.logger.info("UsersService creation");
        
        this.dataLayer = dataLayer;
    }
    async create(resource: CreateUserDto) {

        let userDb = new UsersDB();
        userDb.email = resource.email;
        userDb.name = resource.name;
        userDb.password = resource.password;

        await this.dataLayer.usersRepository.addUser(userDb);
    }

    async deleteById(userId: number) {
        return this.dataLayer.usersRepository.removeUserById(userId);
    }

    async list(limit: number, page: number) {
        return await this.dataLayer.usersRepository.getUsers();
    }

    async patchById(userId: number, resource: PatchUserDto) {
        let entry = await this.dataLayer.usersRepository.findUserById(userId);
        if (!entry) {
            return;
        }
        entry.email = resource.email ?? entry.email;
        entry.name = resource.name ?? entry.name;
        entry.password = resource.password ?? entry.password;
        entry.permissionLevel = resource.permissionFlags ?? entry.permissionLevel;
        
        return this.dataLayer.usersRepository.updateUser(entry);
    }

    async readById(userId: number) {
        return await this.dataLayer.usersRepository.findUserById(userId);
    }

    async putById(userId: number, resource: PutUserDto) {
        let entry = await this.dataLayer.usersRepository.findUserById(userId);
        if (!entry) {
            return;
        }
        entry.email = resource.email ?? entry.email;
        entry.name = resource.name ?? entry.name;
        entry.password = resource.password ?? entry.password;
        entry.permissionLevel = resource.permissionFlags ?? entry.permissionLevel;
        
        return this.dataLayer.usersRepository.updateUser(entry);
    }

    async getUserByEmail(email: string) {
        return await this.dataLayer.usersRepository.getUserByEmail(email);
    }
}

export { UsersService };
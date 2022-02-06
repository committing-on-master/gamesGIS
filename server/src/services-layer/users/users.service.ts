import {inject, injectable} from "tsyringe";
import winston from "winston";
import argon2 from "argon2";

import {CreateUserDto} from "../../dto/request/create.user.dto";
import {PatchUserDto} from "../../dto/request/patch.user.dto";
import {DataLayer} from "../../data-layer/data.layer";
import {UsersDAO} from "../../data-layer/models/users.dao";
import {TokenInjection} from "../../infrastructure/token.injection";
import {RefreshTokensDao} from "../../data-layer/models/refresh.tokens.dao";
import {PermissionFlag} from "./models/permission.flag";

@injectable()
class UsersService {
    private readonly dataLayer: DataLayer;
    private readonly logger: winston.Logger;
    /**
     * Срок жизни refresh token-а в днях
     */
    private readonly refreshTokenExpiration: number;

    constructor(@inject(TokenInjection.LOGGER) logger: winston.Logger,
                @inject(TokenInjection.REFRESH_TOKEN_EXPIRATION) expirationTime: number,
        dataLayer: DataLayer) {
        this.logger = logger;
        this.logger.info("UsersService creation");

        this.refreshTokenExpiration = expirationTime;
        this.dataLayer = dataLayer;
    }

    /**
     * Создаем пользователя в системе
     * @param {CreateUserDto} resource поля для создания пользователя в базе
     * @return {Promise<number>} идентификатор созданного пользователя
     */
    public async createUser(resource: CreateUserDto): Promise<number> {
        const userDb = new UsersDAO();
        userDb.email = resource.email;
        userDb.name = resource.name;
        userDb.passwordHash = await argon2.hash(resource.password);

        const result = await this.dataLayer.usersRepository.addUser(userDb);
        return result.id;
    }


    public async isEmailAvailable(email: string): Promise<boolean> {
        return !await this.dataLayer.usersRepository.isEmailAlreadyExist(email);
    }

    public async isNameAvailable(name: string): Promise<boolean> {
        return !this.dataLayer.usersRepository.isNameAlreadyExist(name);
    }

    public async isUserExist(userId: number): Promise<boolean> {
        return await this.dataLayer.usersRepository.isUserExist(userId);
    }

    /**
     * Обновляем данные пользователя в системе
     * @param {number} userId идентификатор пользователя
     * @param {PatchUserDto} resource обновляемые поля
     */
    public async updateUserById(userId: number, resource: PatchUserDto): Promise<void> {
        const updatingUser = await this.dataLayer.usersRepository.findUserById(userId);
        if (!updatingUser) {
            return;
        }

        updatingUser.email = resource.email ?? updatingUser.email;
        updatingUser.name = resource.name ?? updatingUser.name;
        if (resource.password) {
            updatingUser.passwordHash = await argon2.hash(resource.password);
        }
        this.dataLayer.usersRepository.updateUser(userId, updatingUser);
    }

    public async updateUserPermission(userId: number, permission: PermissionFlag) {
        const updatingUser = await this.dataLayer.usersRepository.findUserById(userId);
        if (!updatingUser) {
            return;
        }
        updatingUser.permissionFlag = permission;
        this.dataLayer.usersRepository.updateUser(userId, updatingUser);
    }

    public async updateUserRefreshToken(userId: number, token: string): Promise<void> {
        const user = await this.dataLayer.usersRepository.findUserById(userId);
        if (user) {
            const existedToken = await this.dataLayer.refreshTokensRepository.findTokenByUserId(userId);
            if (existedToken) {
                existedToken.expiredDate = this.getRefreshTokenExpirationDate();
                existedToken.token = token;
                this.dataLayer.refreshTokensRepository.updateToken(existedToken);
            } else {
                const newToken = new RefreshTokensDao();
                newToken.revoked = false;
                newToken.user = user;
                newToken.expiredDate = this.getRefreshTokenExpirationDate();
                newToken.token = token;

                await this.dataLayer.refreshTokensRepository.addToken(newToken);
            }
        }
    }

    public async revokeUserRefreshToken(userId: number) {
        const existedToken = await this.dataLayer.refreshTokensRepository.findTokenByUserId(userId);
        if (existedToken) {
            existedToken.revoked = true;
            this.dataLayer.refreshTokensRepository.updateToken(existedToken);
        }
    }

    public async getRefreshTokenByUserId(userId: number): Promise<RefreshTokensDao | undefined> {
        return this.dataLayer.refreshTokensRepository.findTokenByUserId(userId);
    }

    public async getRefreshToken(token: string): Promise<RefreshTokensDao | undefined> {
        return this.dataLayer.refreshTokensRepository.getRefreshToken(token, true);
    }

    public async getUserByEmail(email: string) {
        return await this.dataLayer.usersRepository.getUserByEmail(email);
    }

    public async getUserById(userId: number) {
        return await this.dataLayer.usersRepository.findUserById(userId);
    }

    private getRefreshTokenExpirationDate(): Date {
        const currentDate = new Date();
        return new Date(currentDate.getDate() + this.refreshTokenExpiration);
    }

    async deleteById(userId: number) {
        return this.dataLayer.usersRepository.removeUserById(userId);
    }

    async list(limit: number, page: number) {
        return this.dataLayer.usersRepository.getUsers();
    }
}

export {UsersService};

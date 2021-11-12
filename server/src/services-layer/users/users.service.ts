import { CreateUserDto } from './models/create.user.dto';
import { PatchUserDto } from './models/patch.user.dto';
import { inject, injectable } from 'tsyringe';
import { DataLayer } from "../../data-layer/data.layer";
import { UsersDAO } from "../../data-layer/models/users.dao";
import winston from 'winston';
import { TokenInjection } from '../../infrastructure/token.injection';
import argon2 from 'argon2';
import { nameofPropChecker } from '../../infrastructure/name.of.prop.checker';
import { RefreshTokensDao } from '../../data-layer/models/refresh.tokens.dao';

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
     * @param resource поля для создания пользователя в базе
     * @returns идентификатор созданного пользователя
     */
    public async createUser(resource: CreateUserDto): Promise<number> {
        let userDb = new UsersDAO();
        userDb.email = resource.email;
        userDb.name = resource.name;
        userDb.passwordHash = await argon2.hash(resource.password);

        let result = await this.dataLayer.usersRepository.addUser(userDb);
        return result.id;
    }

    /**
     * Проверка данных пользователя на совпадение с ранее зарегистрированными пользователями
     * @param resource поля нового пользователя
     * @returns массив, содержащий сообщения об неверных полях (В случае успешной проверки, возвращает пустой массив)
     */
    public async checkUserDataAvailability(resource: CreateUserDto): Promise<{prop: string, msg:string}[]> {
        let result: {prop: string, msg: string}[] = [];
        if (await this.dataLayer.usersRepository.isNameAlreadyExist(resource.name)) {
            result.push({
                prop: nameofPropChecker<CreateUserDto>("name"),
                msg: `"${resource.name}" is already in use`
            });
        }
        if (await this.dataLayer.usersRepository.isEmailAlreadyExist(resource.email)) {
            result.push({
                prop: nameofPropChecker<CreateUserDto>("email"),
                msg: `"${resource.email}" is already in use`
            });
        }
        return result;
    }

    /**
     * Обновляем данные пользователя в системе
     * @param userId идентификатор пользователя
     * @param resource обновляемые поля
     */
    public async updateUserById(userId: number, resource: PatchUserDto): Promise<void> {
        let updatingUser = await this.dataLayer.usersRepository.findUserById(userId);
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

    public async updateUserRefreshToken(userId: number, token: string): Promise<void> {
        const user = await this.dataLayer.usersRepository.findUserById(userId);
        if (user) {
            const existedToken = await this.dataLayer.refreshTokensRepository.findTokenByUserId(userId);
            if (existedToken) {
                existedToken.expiredDate = this.getRefreshTokenExpirationDate();
                this.dataLayer.refreshTokensRepository.updateToken(existedToken);
            } else {
                let newToken = new RefreshTokensDao();
                newToken.revoked = false;
                newToken.user = user;
                newToken.expiredDate = this.getRefreshTokenExpirationDate();
                
                this.dataLayer.refreshTokensRepository.addToken(newToken);
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
        return await this.dataLayer.refreshTokensRepository.findTokenByUserId(userId);
    }
    
    public async getUserByEmail(email: string) {
        if (!email) {
            return undefined;
        }
        return await this.dataLayer.usersRepository.getUserByEmail(email);
    }

    public async getUserById(userId: number) {
        return await this.dataLayer.usersRepository.findUserById(userId);
    }

    private getRefreshTokenExpirationDate(): Date {
        let currentDate = new Date();
        return new Date(currentDate.getDate() + this.refreshTokenExpiration);
    }

    async deleteById(userId: number) {
        return this.dataLayer.usersRepository.removeUserById(userId);
    }

    async list(limit: number, page: number) {
        return await this.dataLayer.usersRepository.getUsers();
    }
}

export { UsersService };
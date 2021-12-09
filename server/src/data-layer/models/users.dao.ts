/* eslint-disable new-cap */
import {Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {RefreshTokensDao} from "./refresh.tokens.dao";

/**
 * Табличка пользователей в базе данных
 */
@Entity()
class UsersDAO {
    constructor() {
        this.permissionFlag = 1;
    }

    @PrimaryGeneratedColumn()
        id!: number;

    @Column()
        email!: string;

    @Column(/* {length: 128}*/)
        passwordHash!: string;

    @Column({length: 30})
        name!: string;

    @Column()
        permissionFlag: number;

    @CreateDateColumn()
        registrationDate!: Date;

    @OneToOne(() => RefreshTokensDao)
        refreshToken?: RefreshTokensDao;
}

export {UsersDAO};

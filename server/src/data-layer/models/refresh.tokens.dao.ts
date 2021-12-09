/* eslint-disable new-cap */
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {UsersDAO} from "./users.dao";

/**
 * Табличка refresh token-ов в базе данных
 */
 @Entity()
class RefreshTokensDao {
    @PrimaryGeneratedColumn()
        id!: number;

    /**
     * Таблица, относительно которой будет создан foreign key
     */
    @OneToOne(() => UsersDAO)
    @JoinColumn()
        user!: UsersDAO;

    @Column()
        token!: string;

    @Column()
        expiredDate!: Date;

    /**
     * Статус токена на случай logout-а
     * @example
     * true - отозван
     * false - рабочий
     */
    @Column()
        revoked!: boolean;
 }

export {RefreshTokensDao};

/* eslint-disable new-cap */
import {Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {GalleryDao} from "./gallery.dao";
import {MapProfileDao} from "./map.profile.dao";
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

    @OneToMany(() => MapProfileDao, (profile) => profile.user)
        profiles!: MapProfileDao[];

    @OneToMany(() => GalleryDao, (gallery) => gallery.user)
        gallery!: GalleryDao[];
}

export {UsersDAO};

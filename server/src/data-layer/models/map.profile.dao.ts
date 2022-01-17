/* eslint-disable new-cap */
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MapDao} from "./map.dao";
import {MarkerDao} from "./marker.dao";
import {UsersDAO} from "./users.dao";

/**
 * Табличка профилей с для карты
 */
@Entity()
class MapProfileDao {
    @PrimaryGeneratedColumn()
        id!: number;

    @Column()
        name!: string;

    @ManyToOne(() => MapDao, (map) => map.mapProfile)
        map!: MapDao;

    @CreateDateColumn()
        creationDate!: Date;

    @ManyToOne(() => UsersDAO, (users) => users.profiles)
        user!: UsersDAO;

    @OneToMany(() => MarkerDao, (marker) => marker.profile)
        markers?: MarkerDao[];
}

export {MapProfileDao};

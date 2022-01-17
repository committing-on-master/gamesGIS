/* eslint-disable new-cap */
import {CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MarkerDao} from "./marker.dao";
import {UsersDAO} from "./users.dao";

@Entity()
class GalleryDao {
    @PrimaryGeneratedColumn()
        id!: number;

    @CreateDateColumn()
        uploadingDate!: Date;

    @ManyToOne(() => UsersDAO, (user) => user.gallery)
        user!: UsersDAO;

    @ManyToMany(() => MarkerDao, (marker) => marker.gallery)
    @JoinTable()
        markers!: MarkerDao[];
}

export {GalleryDao};

/* eslint-disable new-cap */
import {Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {CoordinatesDao} from "./coordinates.dao";
import {GalleryDao} from "./gallery.dao";
import {MapProfileDao} from "./map.profile.dao";


/**
 * Табличка меток для определенного профиля
 */
@Entity()
class MarkerDao {
    @PrimaryGeneratedColumn()
        id!: number;

    @Column()
        name!: string;

    @Column()
        description!: string;

    @Column({type: "decimal"})
        xCoordinate!: number;

    @Column({type: "decimal"})
        yCoordinate!: number;

    @CreateDateColumn()
        creationDate!: Date;

    @ManyToOne(() => MapProfileDao, (profile) => profile.markers)
        profile!: MapProfileDao;

    @OneToMany(() => CoordinatesDao, (coordinate) => coordinate.marker)
        area!: CoordinatesDao[];

    @ManyToMany(() => GalleryDao, (gallery) => gallery.markers)
        gallery!: GalleryDao[];
}

export {MarkerDao};

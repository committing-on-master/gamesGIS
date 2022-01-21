/* eslint-disable new-cap */
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {MapProfileDao} from "./map.profile.dao";
import {Coordinate} from "./parts/coordinate";

@Entity()
class MapDao {
    @PrimaryGeneratedColumn()
        mapType!: number;

    @Column()
        name!: string;

    @Column()
        layers!: number;

    @Column()
        defaultLayer!: number;

    @Column(() => Coordinate)
        center!: Coordinate;

    @Column(() => Coordinate)
        leftBottom!: Coordinate;

    @Column(() => Coordinate)
        rightTop!: Coordinate;

    @Column()
        minZoom!: number;

    @Column()
        maxZoom!: number;

    @OneToMany(() => MapProfileDao, (profile) => profile.map)
        mapProfile?: MapProfileDao;
}

export {MapDao};

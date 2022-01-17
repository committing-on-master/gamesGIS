/* eslint-disable new-cap */
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {MarkerDao} from "./marker.dao";

@Entity()
class CoordinatesDao {
    @PrimaryGeneratedColumn()
        id!: number;

    @Column()
        order!: number;

    @Column({type: "decimal"})
        xCoordinate!: number;

    @Column({type: "decimal"})
        yCoordinate!: number;

    @ManyToOne(() => MarkerDao, (marker) => marker.area)
        marker!: MarkerDao;
}

export {CoordinatesDao};

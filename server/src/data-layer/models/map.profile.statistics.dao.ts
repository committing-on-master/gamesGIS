/* eslint-disable new-cap */
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {MapProfileDao} from "./map.profile.dao";

/**
 * Табличка профилей с для карты
 */
@Entity()
class MapProfileStatisticsDao {
    @PrimaryGeneratedColumn()
        id!: number;

    @OneToOne(() => MapProfileDao)
    @JoinColumn()
        profile!: MapProfileDao;

    @Column()
        viewsCount!: number;
}

export {MapProfileStatisticsDao};

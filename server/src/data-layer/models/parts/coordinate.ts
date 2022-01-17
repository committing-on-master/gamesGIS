/* eslint-disable new-cap */
import {Column} from "typeorm";

class Coordinate {
    @Column({type: "decimal"})
        X!: number;

    @Column({type: "decimal"})
        Y!: number;
}

export {Coordinate};

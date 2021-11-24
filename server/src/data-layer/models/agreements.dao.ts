import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Табличка пользовательских соглашений
 */
@Entity()
class AgreementsDAO {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    version!: number;

    @Column()
    agreementBody!: string;

    @CreateDateColumn()
    creationDate!: Date;
}

export { AgreementsDAO }
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * Табличка пользователей в базе данных
 */
@Entity()
class UsersDB {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    email!: string;

    @Column(/*{length: 128}*/)
    password!: string;

    @Column({length: 30})
    name!: string;

    @Column({nullable: true})
    permissionLevel?: number;

    @CreateDateColumn()
    registrationDate!: Date;
}

export { UsersDB }
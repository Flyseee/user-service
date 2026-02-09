import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {UserRoles} from "../../enums/user-roles.enum";
import {UserStatuses} from "../../enums/user-statuses.enum";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id!: string;

    @Column({ type: 'varchar', length: 255, name: 'first_name' })
    firstName!: string;

    @Column({ type: 'varchar', length: 255, name: 'last_name' })
    lastName!: string;

    @Column({ type: 'varchar', length: 255, name: 'second_name' })
    secondName!: string;

    @Column({ type: 'date', name: 'birthday' })
    birthday!: Date;

    @Column({ type: 'varchar', length: 255, unique: true, name: 'email' })
    email!: string;

    @Column({ type: 'varchar', length: 255, unique: true, name: 'password' })
    password!: string;

    @Column({ type: 'enum', enum: UserRoles , name: 'role'})
    role!: UserRoles;

    @Column({ type: 'enum', enum: UserStatuses, name: 'status' })
    status!: UserStatuses;
}
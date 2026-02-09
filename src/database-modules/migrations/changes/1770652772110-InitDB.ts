import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDB1770652772110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE user_role AS ENUM ('admin', 'user');
            CREATE TYPE user_status AS ENUM ('active', 'inactive');
        `)
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user" (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                second_name VARCHAR(255) NOT NULL,
                birthday DATE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role user_role DEFAULT 'user'::user_role NOT NULL,
                status user_status DEFAULT 'active'::user_status NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

import 'reflect-metadata';
import path from 'path';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    logging: process.env.NODE_ENV !== 'production',
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [path.join(__dirname, '/../../**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, '/../migrations/changes/**/*{.ts,.js}')],
    migrationsRun: true,
    synchronize: false,
});
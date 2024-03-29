import { join } from 'path';
import { registerAs } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';

export const DATABASE_CONFIG = 'DATABASE_CONFIG';

export default registerAs(
  DATABASE_CONFIG,
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    entities: [join(__dirname, './../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, './../migrations/**/*{.ts,.js}')],
  }),
);

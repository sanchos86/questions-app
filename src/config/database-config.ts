import { join } from 'path';
import { registerAs } from '@nestjs/config';
import { ConnectionOptions } from 'typeorm';

export const DATABASE_CONFIG = 'DATABASE_CONFIG';

export default registerAs(
  DATABASE_CONFIG,
  (): ConnectionOptions => ({
    type: 'mysql',
    port: 3306,
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: false,
    entities: [join(__dirname, './../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, './../migrations/**/*{.ts,.js}')],
    cli: {
      migrationsDir: 'src/migrations',
    },
  }),
);

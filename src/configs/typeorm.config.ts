import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'pgsql',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'localuser',
  password: String(process.env.DATABASE_PASSWORD) || 'userpass',
  database: process.env. DATABASE_NAME || 'database',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
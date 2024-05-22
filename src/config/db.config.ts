import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface partialDbConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  url?: string;
}

function buildConnection(): partialDbConfig {
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
    };
  }

  const dbHost = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 5432;
  const username = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || 'root';
  const database = process.env.DB_NAME;
  return {
    host: dbHost,
    port: port,
    username: username,
    password: password,
    database: database,
  };
}

function isLocalhost(dbHost: string) {
  return dbHost === 'localhost' || dbHost === '127.0.0.1';
}

export function dbConfig(): TypeOrmModuleOptions {
  const dbType =
    (process.env.DB_TYPE as PostgresConnectionOptions['type']) || 'postgres';
  const partialDbConfig = buildConnection();

  return {
    ...partialDbConfig,
    logging: process.env.DB_LOGGING?.toLowerCase() === 'true',
    type: dbType,
    entities: [__dirname + '/../domains/**/*.entity{.ts,.js}'],
    synchronize: process.env.DB_SYNCHRONIZE?.toLowerCase() === 'true',
    ssl:
      process.env.DB_SSL?.toLowerCase() === 'false' &&
      isLocalhost(partialDbConfig.host)
        ? false
        : {
            rejectUnauthorized: false,
          },
    dropSchema: process.env.DB_DROP_SCHEMA?.toLowerCase() === 'true',
    migrationsRun: process.env.DB_MIGRATION_RUN?.toLowerCase() === 'true',
    migrations: ['../db/migrations/*.ts'],
  };
}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { appConfig, AppConfig } from './app-config';
import { dbConfig } from './db.config';

export interface AllConfig {
  app: AppConfig;
  db: TypeOrmModuleOptions;
}

export function allConfig(): AllConfig {
  return {
    app: appConfig(),
    db: dbConfig(),
  };
}

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as PostgresConnectionStringParser from 'pg-connection-string';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    if (mode === 'DEV') return false;
    else
      return {
        rejectUnauthorized: false,
      };
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    const connectionOptions = PostgresConnectionStringParser.parse(
      this.getValue('DATABASE_URL'),
    );
    return {
      type: 'postgres',
      host: connectionOptions.host,
      port: Number(connectionOptions.port),
      username: connectionOptions.user,
      password: connectionOptions.password,
      database: connectionOptions.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      ssl: this.isProduction(),

      autoLoadEntities: true,

      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };

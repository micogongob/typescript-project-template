import { BaseEnvHelper, ConfigStarter, ConfigStarterUtils } from '@local/starter-core';
import { DatabaseClientParams } from '../types';
import { DatabaseClientStarter } from './database-client.starter';

export class DatabaseEnvHelper {
  static getDatabaseHost(): string {
    return BaseEnvHelper.getRequiredString('DB_HOST');
  }
  static getDatabasePort(): number {
    return BaseEnvHelper.getRequiredNumber('DB_PORT');
  }
  static getDatabaseName(): string {
    return BaseEnvHelper.getRequiredString('DB_NAME');
  }
  static getDatabaseUser(): string {
    return BaseEnvHelper.getRequiredString('DB_USER');
  }
  static getDatabasePassword(): string {
    return BaseEnvHelper.getRequiredString('DB_PASS');
  }
}

export class DatabaseConfigStarter implements ConfigStarter {
  private databaseClient?: DatabaseClientStarter;

  constructor(
    private dbParams?: DatabaseClientParams
  ) {
    this.dbParams = dbParams;
  }

  async initialize(): Promise<void> {
    this.databaseClient = new DatabaseClientStarter(this.dbParams);
  }

  getDatabaseClient(): DatabaseClientStarter {
    return ConfigStarterUtils.getRequiredField<DatabaseClientStarter>(this.databaseClient);
  }
}

import { DatabaseEnvHelper } from './config.starter';
import * as errors from '../errors';
import * as types from '../types';

import { knex, Knex } from 'knex';
import { z } from 'zod';

export class DatabaseClientStarter {
  private defaultClient?: Knex;

  constructor(
    options?: types.DatabaseClientOptions
  ) {
    this.defaultClient = knex({
      client: this.getDefaultEngine(options),
      connection: {
        host: DatabaseEnvHelper.getDatabaseHost(),
        port: DatabaseEnvHelper.getDatabasePort(),
        database: DatabaseEnvHelper.getDatabaseName(),
        user: DatabaseEnvHelper.getDatabaseUser(),
        password: DatabaseEnvHelper.getDatabasePassword()
      },
      pool: this.getDefaultConnectionPool(options),
      debug: this.getDefaultDebugValue(options)
    });
  }

  private getDefaultEngine(options?: types.DatabaseClientOptions): types.DatabaseEngine {
    if (options === undefined || options.engine === undefined) {
      return 'pg';
    }
    return options.engine;
  }

  private getDefaultConnectionPool(options?: types.DatabaseClientOptions): types.DatabaseConnectionPool | undefined {
    if (options === undefined || options.connectionPool === undefined) {
      return undefined;
    }
    return options.connectionPool;
  }


  private getDefaultDebugValue(options?: types.DatabaseClientOptions): boolean {
    if (options === undefined || options.debug === undefined) {
      return false;
    }
    return options.debug;
  }

  async execute<T>(
    operation: (queryClient: Knex | Knex.Transaction) => Promise<any>,
    options?: types.ExecuteQueryOptions
  ): Promise<T> {
    const queryResult: any = await operation(this.determineClient(options));
    return this.mapQueryResult<T>(queryResult, options);
  }

  // TODO update resolving nested transactions?
  async executeInTransaction<T>(
    operation: (queryClient: Knex.Transaction) => Promise<any>,
    options?: types.ExecuteQueryOptions
  ): Promise<T> {
    return await this.determineClient(options).transaction(async (trx) => {
      const queryResult: any = await operation(trx);
      return this.mapQueryResult<T>(queryResult, options);
    }, { isolationLevel: this.mapIsolationLevel(options) });
  }

  private determineClient(options?: types.ExecuteQueryOptions): Knex | Knex.Transaction {
    if (options !== undefined && options.transaction !== undefined) {
      return options.transaction;
    }
    if (this.defaultClient !== undefined) {
      return this.defaultClient;
    }
    throw errors.DatabaseGenericException.withMessage('Database client is not initialized!');
  }

  private mapQueryResult<T>(queryResult: any, options?: types.ExecuteQueryOptions): T {
    this.validateNullishDatabaseValue(queryResult, options);

    if (options === undefined || options.mapper === undefined) {
      return queryResult as T;
    }

    if (Array.isArray(queryResult)) {
      const mapped: any[] = [];
      for (const raw of queryResult) {
        mapped.push(this.toMappedObject(options.mapper, raw));
      }
      return mapped as T;
    } else {
      return this.toMappedObject(options.mapper, queryResult) as T;
    }
  }

  private validateNullishDatabaseValue(queryResult: any, options?: types.ExecuteQueryOptions): void {
    if (!this.allowNullish(options)) {
      if (Array.isArray(queryResult)) {
        if (queryResult === undefined || queryResult === null || queryResult.length <= 0) {
          throw errors.DatabaseEmptyResultException.withMessage('Empty database result!');
        }
      } else {
        if (queryResult === undefined || queryResult === null) {
          throw errors.DatabaseEmptyResultException.withMessage('Null database result!');
        }
      }
    }
  }

  private allowNullish(options?: types.ExecuteQueryOptions): boolean {
    if (options === undefined || options.allowNullish === undefined) {
      return true;
    }
    return options.allowNullish;
  }

  private toMappedObject<T>(mapper: z.ZodTypeAny, object: Record<string, any>): T {
    const validated = mapper.safeParse(object);
    if (validated.success) {
      return validated.data as T;
    }
    throw errors.DatabaseQueryResultMalformedException.withMessage(`Malformed database values: ${JSON.stringify(object)}`);
  }

  private mapIsolationLevel(options?: types.ExecuteQueryOptions): Knex.IsolationLevels | undefined {
    if (options === undefined || options.isolationLevel === undefined) {
      return undefined;
    }
    switch (options.isolationLevel) {
      case 'READ_UNCOMMITTED':
        return 'read uncommitted';
      case 'READ_COMMITTED':
        return 'read committed';
      case 'REPEATABLE_READ':
        return 'repeatable read';
      case 'SERIALIZABLE':
        return 'serializable';
      default:
        throw errors.DatabaseGenericException.withMessage('Unknown isolation level provided');
    }
  }
}
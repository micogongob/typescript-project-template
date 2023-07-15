import { DatabaseEnvHelper } from './database-config.starter';
import * as errors from '../errors';
import * as types from '../types';

import { knex, Knex } from 'knex';
import { z } from 'zod';

export class DatabaseClientStarter {
  private defaultClient?: Knex;

  constructor(
    params?: types.DatabaseClientParams
  ) {
    this.defaultClient = knex({
      client: this.getInitParamEngine(params),
      connection: {
        host: DatabaseEnvHelper.getDatabaseHost(),
        port: DatabaseEnvHelper.getDatabasePort(),
        database: DatabaseEnvHelper.getDatabaseName(),
        user: DatabaseEnvHelper.getDatabaseUser(),
        password: DatabaseEnvHelper.getDatabasePassword()
      },
      pool: this.getInitParamConnectionPool(params)
    });
  }

  private getInitParamEngine(params?: types.DatabaseClientParams): types.DatabaseClientEngine {
    if (params === undefined || params.engine === undefined) {
      return 'pg';
    }
    return params.engine;
  }

  private getInitParamConnectionPool(params?: types.DatabaseClientParams): types.DatabaseClientConnectionPool | undefined {
    if (params === undefined || params.connectionPool === undefined) {
      return undefined;
    }
    return params.connectionPool;
  }

  // TODO handle updates
  // TODO support transaction
  async execute<T>(
    operation: (queryClient: Knex | Knex.Transaction) => Promise<any>,
    params?: types.ExecuteQueryParams
  ): Promise<T> {
    const queryResult: any = await operation(this.determineClient(params));
    return this.mapQueryResult<T>(queryResult, params);
  }

  private determineClient(params?: types.ExecuteQueryParams): Knex | Knex.Transaction {
    if (params !== undefined && params.transaction !== undefined) {
      return params.transaction;
    }
    if (this.defaultClient !== undefined) {
      return this.defaultClient;
    }
    throw errors.DatabaseGenericException.withMessage('Database client is not initialized!');
  }

  private mapQueryResult<T>(queryResult: any, params?: types.ExecuteQueryParams): T {
    this.validateNullishDatabaseValue(queryResult, params);

    if (params === undefined || params.mapper === undefined) {
      return queryResult as T;
    }

    if (Array.isArray(queryResult)) {
      const mapped: any[] = [];
      for (const raw of queryResult) {
        mapped.push(this.toMappedObject(params.mapper, raw));
      }
      return mapped as T;
    } else {
      return this.toMappedObject(params.mapper, queryResult) as T;
    }
  }

  private validateNullishDatabaseValue(queryResult: any, params?: types.ExecuteQueryParams): void {
    if (!this.allowNullish(params)) {
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

  private allowNullish(params?: types.ExecuteQueryParams): boolean {
    if (params === undefined || params.allowNullish === undefined) {
      return false;
    }
    return params.allowNullish;
  }

  private toMappedObject<T>(mapper: z.ZodTypeAny, object: Record<string, any>): T {
    const validated = mapper.safeParse(object);
    if (validated.success) {
      return validated.data as T;
    }
    throw errors.DatabaseQueryResultMalformedException.withMessage(`Malformed database values: ${JSON.stringify(object)}`);
  }
}


import { Knex } from 'knex';
import { z } from 'zod';

export type RepositoryQueryParams = {
  transaction?: Knex.Transaction;
};

export type ExecuteQueryParams = RepositoryQueryParams & {
  mapper?: z.ZodTypeAny;
  allowNullish?: boolean;
};

export type DatabaseClientEngine = 'pg' | 'mysql';
export type DatabaseClientConnectionPool = {
  min: number;
  max: number;
};

export type DatabaseClientParams = {
  engine?: DatabaseClientEngine;
  connectionPool?: DatabaseClientConnectionPool;
};
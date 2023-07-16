import { Knex } from 'knex';
import { z } from 'zod';

export type IsolationLevel = 'READ_UNCOMMITTED'
  | 'READ_COMMITTED'
  | 'REPEATABLE_READ'
  | 'SERIALIZABLE';

export type TransactionOptions = {
  transaction?: Knex.Transaction;
  isolationLevel?: IsolationLevel
};

export type ExecuteQueryOptions = TransactionOptions & {
  mapper?: z.ZodTypeAny;
  allowNullish?: boolean;
};

export type DatabaseEngine = 'pg' | 'mysql';
export type DatabaseConnectionPool = {
  min: number;
  max: number;
};

export type DatabaseClientOptions = {
  engine?: DatabaseEngine;
  connectionPool?: DatabaseConnectionPool;
  debug?: boolean;
};

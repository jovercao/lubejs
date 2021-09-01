import { Parameter } from "../ast/expression/parameter";
import { Executor } from "./executor";
import { QueryResult } from "./types";

export type TransactionHandler<T> = (
  executor: Executor,
  abort: () => Promise<void>
) => Promise<T>;

/**
 * 数据库事务
 */
export interface Transaction {
  query(sql: string, params?: Parameter[]): Promise<QueryResult<any, any, any>>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

/**
 * 事务隔离级别
 */
 export enum ISOLATION_LEVEL {
  READ_COMMIT = 'READ_COMMIT',
  READ_UNCOMMIT = 'READ_UNCOMMIT',
  REPEATABLE_READ = 'REPEATABLE_READ',
  SERIALIZABLE = 'SERIALIZABLE',
  SNAPSHOT = 'SNAPSHOT'
}

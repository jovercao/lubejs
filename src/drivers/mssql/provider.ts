import mssql from 'mssql';
import { doQuery } from './query';
import { toMssqlIsolationLevel } from './types';
import { MssqlCompiler } from './compile';
import {
  CompileOptions,
  DbProvider,
  ISOLATION_LEVEL,
  Parameter,
  Transaction,
  MigrateScripter,
  DatabaseSchema,
} from '../..';
import { MssqlMigrateScripter } from './migrate-scripter';
import { load } from './schema-loader'

export class MssqlProvider implements DbProvider {
  constructor(private _pool: mssql.ConnectionPool, options: CompileOptions) {
    this.compiler = new MssqlCompiler(options);
    this.scripter = new MssqlMigrateScripter(this.compiler);
  }

  getSchema(): Promise<DatabaseSchema> {
    return load(this);
  }

  readonly scripter: MigrateScripter;

  readonly compiler: MssqlCompiler;

  async query(sql: string, params: Parameter<any, string>[]) {
    const res = await doQuery(this._pool, sql, params, this.compiler.options);
    return res;
  }

  async beginTrans(
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ): Promise<Transaction> {
    const trans = this._pool.transaction();
    await trans.begin(toMssqlIsolationLevel(isolationLevel));
    return {
      async query(sql, params) {
        const res = await doQuery(trans, sql, params, this.compiler.options);
        return res;
      },
      async commit() {
        await trans.commit();
      },
      async rollback() {
        await trans.rollback();
      },
    };
  }

  /**
   * 关闭所有连接
   * @memberof Pool
   */
  async close() {
    await this._pool.close();
  }
}

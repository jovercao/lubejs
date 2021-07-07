import mssql from 'mssql';
import { doQuery } from './query';
import { toMssqlIsolationLevel } from './types';
import { MssqlSqlUtil, MssqlStandardTranslator } from './sql-util';
import {
  SqlOptions,
  DbProvider,
  ISOLATION_LEVEL,
  Parameter,
  Transaction,
  DatabaseSchema,
  MigrateBuilder,
  Lube,
} from 'lubejs';
import { load } from './schema-loader';
import { MssqlMigrateBuilder } from './migrate-builder';

export const DIALECT = Symbol('mssql');

export class MssqlProvider implements DbProvider {
  constructor(private _pool: mssql.ConnectionPool, options: SqlOptions) {
    const translator = new MssqlStandardTranslator(this);
    this.sqlUtil = new MssqlSqlUtil(options, translator);
    translator.sqlUtil = this.sqlUtil;
  }

  lube!: Lube;
  readonly sqlUtil: MssqlSqlUtil;
  private _migrateBuilder?: MssqlMigrateBuilder;
  get migrateBuilder(): MigrateBuilder {
    if (!this._migrateBuilder) {
      this._migrateBuilder = new MssqlMigrateBuilder(this);
    }
    return this._migrateBuilder;
  }

  dialect: string | symbol = DIALECT;

  getSchema(): Promise<DatabaseSchema> {
    return load(this);
  }

  async query(sql: string, params: Parameter<any, string>[]) {
    const res = await doQuery(this._pool, sql, params, this.sqlUtil.options);
    return res;
  }

  async beginTrans(
    isolationLevel: ISOLATION_LEVEL = 'READ_COMMIT'
  ): Promise<Transaction> {
    const trans = this._pool.transaction();
    let rolledBack = false;
    trans.on('rollback', aborted => {
      // emited with aborted === true

      rolledBack = true
    })
    await trans.begin(toMssqlIsolationLevel(isolationLevel));
    return {
      query: async (sql, params) => {
        const res = await doQuery(trans, sql, params, this.sqlUtil.options);
        return res;
      },
      commit: async() => {
        await trans.commit();
      },
      rollback: async() => {
        if (!rolledBack) {
          await trans.rollback();
        }
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

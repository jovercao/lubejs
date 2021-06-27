import mssql from 'mssql';
import { doQuery } from './query';
import { toMssqlIsolationLevel } from './types';
import { MssqlCompiler, MssqlStandardTranslator } from './compile';
import {
  CompileOptions,
  DbProvider,
  ISOLATION_LEVEL,
  Parameter,
  Transaction,
  DatabaseSchema,
} from '../..';
import { load } from './schema-loader'
import { MigrateBuilder } from '../../migrate-builder'
import { MssqlMigrateBuilder } from './migrate-builder'
import { Lube } from '../../lube'

export const DIALECT = Symbol('mssql');

export class MssqlProvider implements DbProvider {
  constructor(private _pool: mssql.ConnectionPool, options: CompileOptions) {
    const translator = new MssqlStandardTranslator(this);
    this.compiler = new MssqlCompiler(options, translator);
    translator.compiler = this.compiler;
  }

  readonly lube: Lube;
  readonly compiler: MssqlCompiler;
  private _migrateBuilder: MssqlMigrateBuilder;
  get migrateBuilder(): MigrateBuilder {
    if (!this._migrateBuilder) {
      this._migrateBuilder = new MssqlMigrateBuilder(this);
    }
    return this._migrateBuilder;
  }

  dialect: string | symbol = DIALECT

  getSchema(): Promise<DatabaseSchema> {
    return load(this);
  }


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

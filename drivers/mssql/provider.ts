import mssql from 'mssql';
import { doQuery } from './query';
import { MssqlConnectOptions, toMssqlIsolationLevel } from './types';
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
  ConnectOptions,
  SqlBuilder,
} from 'lubejs';
import { loadDatabaseSchema } from './schema-loader';
import { MssqlMigrateBuilder } from './migrate-builder';
import { parseMssqlConfig } from './util'
import { db_name, schema_name } from './build-in';

export const DIALECT = 'mssql';

export const DefaultConnectOptions: mssql.config = {
  server: 'localhost',
  // 端口号
  port: 1433,
  options: {
    encrypt: false,
    trustedConnection: true,
  },
  // 请求超时时间
  requestTimeout: 60000,
  // 连接超时时间
  connectionTimeout: 15000,
  // 开启JSON
  parseJSON: true,
  // // 严格模式
  // strict: true,
};
export class MssqlProvider implements DbProvider {
  constructor(public options: MssqlConnectOptions) {
    const translator = new MssqlStandardTranslator(this);
    this.sqlUtil = new MssqlSqlUtil(options.sqlOptions, translator);
  }
  getCurrentDatabase(): Promise<string> {
    return this.lube.queryScalar(SqlBuilder.select(db_name()));
  }
  getDefaultSchema(): Promise<string> {
    return this.lube.queryScalar(SqlBuilder.select(schema_name()));
  }
  private _pool?: mssql.ConnectionPool;
  lube!: Lube;
  readonly sqlUtil: MssqlSqlUtil;
  private _migrateBuilder?: MssqlMigrateBuilder;
  get migrateBuilder(): MigrateBuilder {
    if (!this._migrateBuilder) {
      this._migrateBuilder = new MssqlMigrateBuilder(this);
    }
    return this._migrateBuilder;
  }

  dialect: string = DIALECT;

  private _database?: string;
  get database(): string | undefined {
    return this._database || this.options.database;
  }

  getSchema(): Promise<DatabaseSchema> {
    this._assertConnection();
    return loadDatabaseSchema(this);
  }

  private _assertConnection(): void {
    if (!this._pool) {
      throw new Error(`Connection is not opened yet.`)
    }
  }

  async query(sql: string, params: Parameter<any, string>[]) {
    this._assertConnection();
    const res = await doQuery(this._pool!, sql, params, this.sqlUtil.options);
    return res;
  }

  async beginTrans(
    isolationLevel: ISOLATION_LEVEL = 'READ_COMMIT'
  ): Promise<Transaction> {
    this._assertConnection();
    const trans = this._pool!.transaction();
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

  get opened() {
    return !!this._pool;
  }

  async change(database: string | undefined): Promise<void> {
    let opened = this.opened;
    if (opened) {
      await this.close();
    }
    this.options.database = database;
    if (opened) {
      await this.open();
    }
  }

  /**
   * 关闭所有连接
   * @memberof Pool
   */
  async close(): Promise<void> {
    this._assertConnection();
    await this._pool!.close();
    this._pool = undefined;
    this._database = undefined;
  }

  async open(): Promise<void> {
    if (this._pool) {
      throw new Error(`Connection is opened.`)
    }
    const sqlconfig = parseMssqlConfig(this.options);
    const pool = new mssql.ConnectionPool(sqlconfig);
    await pool.connect();
    this._pool = pool;
    const result = await this._pool.query(`sp_who  @@SPID`);
    this._database = result.recordset[0].dbname;
  }
}

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
import { parseMssqlConfig } from './util';
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

  getDefaultSchema(database?: string): Promise<string> {
    return this.lube.trans(async trans => {
      const currentDatabase = await this.getCurrentDatabase();
      if (database && currentDatabase !== database) {
        trans.query(SqlBuilder.use(database));
      }
      const defaultSchema = await trans.queryScalar(
        SqlBuilder.select(schema_name())
      );
      if (database && currentDatabase !== database) {
        await trans.query(SqlBuilder.use(currentDatabase));
      }
      return defaultSchema;
    });
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

  async getSchema(dbname?: string): Promise<DatabaseSchema | undefined> {
    await this._autoOpen();
    return loadDatabaseSchema(this, dbname);
  }

  private async _autoOpen(): Promise<void> {
    if (!this.opened) {
      await this.open();
    }
  }

  async query(sql: string, params: Parameter<any, string>[]) {
    await this._autoOpen();
    const res = await doQuery(this._pool!, sql, params, this.sqlUtil.options);
    return res;
  }

  async beginTrans(
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ): Promise<Transaction> {
    await this._autoOpen();
    const trans = this._pool!.transaction();
    let rolledBack = false;
    trans.on('rollback', aborted => {
      // emited with aborted === true
      rolledBack = true;
    });
    await trans.begin(toMssqlIsolationLevel(isolationLevel));
    return {
      query: async (sql, params) => {
        const res = await doQuery(trans, sql, params, this.sqlUtil.options);
        return res;
      },
      commit: async () => {
        await trans.commit();
      },
      rollback: async () => {
        // fix: 解决mssql库自动rollback导致重复调用rollback的bug
        if (!rolledBack) {
          await trans.rollback();
        }
      },
    };
  }

  get opened() {
    return !!this._pool;
  }

  changeDatabase(database: string | null): void {
    if (this.opened) {
      throw new Error(`Not allow change database when connection is opened.`);
    }
    if (this.mssqlOptions.database === database) {
      return;
    }
    // let opened = this.opened;
    // if (opened) {
    //   await this.close();
    // }
    this.mssqlOptions.database = database === null ? undefined : database;
    // if (opened) {
    //   await this.open();
    // }
  }

  /**
   * 关闭所有连接
   * @memberof Pool
   */
  async close(): Promise<void> {
    if (!this.opened) {
      throw new Error(`Connection pool is not opened yet.`);
    }
    await this._pool!.close();
    this._pool = undefined;
  }

  private _mssqlOptions?: mssql.config;
  private get mssqlOptions(): mssql.config {
    if (!this._mssqlOptions) {
      this._mssqlOptions = parseMssqlConfig(this.options);
    }
    return this._mssqlOptions;
  }

  async open(): Promise<void> {
    if (this._pool) {
      throw new Error(`Connection pool is opened.`);
    }
    const pool = new mssql.ConnectionPool(this.mssqlOptions);
    await pool.connect();
    this._pool = pool;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Executor, QueryResult } from './execute';
import { URL } from 'url';
import { ISOLATION_LEVEL } from './constants';
import assert from 'assert';
import { SqlOptions, SqlUtil, StandardTranslator } from './sql-util';
import { Parameter } from './ast';
import { DatabaseSchema } from './schema';
import { MigrateBuilder } from './migrate-builder';
import { existsSync } from 'fs';
import { join } from 'path';
import { DbContext, DbContextConstructor, LubeConfig } from './orm';
import { Constructor } from './types';
import { metadataStore } from './metadata';

export type ConnectOptions = {
  /**
   * 数据库方言(必须是已注册的言)，与driver二选一，必须安装相应的驱动才可正常使用
   */
  dialect?: string;
  /**
   * 驱动程序，与dialect二选一，优先使用driver
   */
  driver?: Driver;
  /**
   * 主机名
   */
  host: string;
  /**
   * 端口号
   */
  port?: number;
  /**
   * 连接用户名
   */
  user: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 数据库名称
   */
  database: string;
  /**
   * 连接池最大连接数，单位为秒，默认为5
   */
  maxConnections?: number;
  /**
   * 连接池最小连接数，默认为1
   */
  minConnections?: number;
  /**
   * 连接超时时长，单位: ms，默认为15000ms
   */
  connectionTimeout?: number;
  /**
   * 单个查询超时时长,单位: ms，默认为15000ms
   */
  requestTimeout?: number;
  /**
   * 回收未使用的连接等待时长，单位: ms，默认为30000ms
   */
  recoveryConnection?: number;
  /**
   * 编译选项
   */
  sqlOptions?: SqlOptions;
};

const defaultConnectOptions: Partial<ConnectOptions> = {
  connectionTimeout: 30,
  requestTimeout: 10 * 60,
  minConnections: 0,
  maxConnections: 5,
};

export type TransactionHandler<T> = (
  executor: Executor,
  abort: () => Promise<void>
) => Promise<T>;

/**
 * 数据库提供驱动程序
 */
export interface DbProvider {
  /**
   * lube对象
   */
  lube: Lube;
  readonly sqlUtil: SqlUtil;
  readonly migrateBuilder: MigrateBuilder;
  query(sql: string, params?: Parameter[]): Promise<QueryResult<any, any, any>>;
  beginTrans(isolationLevel: ISOLATION_LEVEL): Promise<Transaction>;
  close(): Promise<void>;

  /**
   * 方言名称，如'mssql', 'mysql', 'oracle'
   */
  readonly dialect: string | symbol;

  // getTables(options?: {
  //   name?: string;
  //   schema?: string;
  //   kind: 'view' | 'table';
  // }): Promise<{
  //   name: string;
  //   schema: string;
  //   type: 'view' | 'table';
  //   description: string;
  // }>;

  // /**
  //  * 获取表列
  //  * @param table
  //  */
  // getColumns(table: string): Promise<{ table: string; type: string; nullable: boolean; identity: boolean;  }[]>;

  // /**
  //  * 获取源代码
  //  * @param objName
  //  */
  // getSource(objName: string): Promise<string>;

  /**
   * 获取数据库架构
   */
  getSchema(): Promise<DatabaseSchema>;
}

/**
 * 驱动程序
 * 实际上为一个工厂函数，通过实现该方法来扩展驱动支持
 */
export interface Driver {
  (config: ConnectOptions): Promise<DbProvider>;
}

/**
 * 数据库事务
 */
export interface Transaction {
  query(sql: string, params: Parameter[]): Promise<QueryResult<any, any, any>>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export class Lube extends Executor {
  public readonly provider: DbProvider;

  constructor(provider: DbProvider) {
    const sqlUtil = provider.sqlUtil;
    super(provider.query.bind(provider), sqlUtil);
    this.provider = provider;
    this.provider.lube = this;
  }

  /**
   * 开启一个事务并自动提交
   * @param {*} handler (exeutor, cancel) => false
   * @param {*} isolationLevel 事务隔离级别
   */
  async trans<T>(
    handler: TransactionHandler<T>,
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ): Promise<T> {
    if (this.isTrans) {
      throw new Error('is in transaction now');
    }
    let canceled = false;
    const { query, commit, rollback } = await this.provider.beginTrans(
      isolationLevel
    );
    const executor = new Executor(query, this.sqlUtil, true);
    const abort = async () => {
      canceled = true;
      await rollback();
      executor.emit('rollback', executor);
    };
    const complete = async () => {
      await commit();
      executor.emit('commit', executor);
    };
    executor.on('command', cmd => this._emitter.emit('command', cmd));
    executor.on('error', cmd => this._emitter.emit('error', cmd));
    try {
      const res = await handler(executor, abort);
      if (!canceled) {
        await complete();
      }
      return res;
    } catch (ex) {
      if (!canceled) {
        await abort();
      }
      throw ex;
    }
  }

  async close(): Promise<void> {
    await this.provider.close();
  }
}

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function connect(url: string): Promise<Lube>;
export async function connect(options: ConnectOptions): Promise<Lube>;
export async function connect(
  optionOrUrlOrConfigname?: ConnectOptions | string
): Promise<Lube>;
export async function connect(
  optionOrUrlOrConfigname?: ConnectOptions | string
): Promise<Lube> {
  let options: ConnectOptions;
  if (!optionOrUrlOrConfigname) {
    const config = await loadConfig();
    if (!config?.default || !config?.configures?.[config.default]) {
      throw new Error(`Default lubejs options not found in configure.`);
    }
    options = config.configures[config.default];
  } else {
    if (typeof optionOrUrlOrConfigname === 'string') {
      if (optionOrUrlOrConfigname.indexOf(':') < 0) {
        const config = await loadConfig();
        options = config?.configures?.[optionOrUrlOrConfigname];
        if (!options) {
          throw new Error(
            `Lubejs options ${optionOrUrlOrConfigname} not found in configure.`
          );
        }
      } else {
        const url = new URL(optionOrUrlOrConfigname);
        const params = url.searchParams;
        const urlOptions: Record<string, string> = {};
        for (const [key, value] of params.entries()) {
          if (value !== undefined) {
            urlOptions[key] = value;
          }
        }
        const dialect = url.protocol
          .substr(0, url.protocol.length - 1)
          .toLowerCase();
        try {
          options = {
            dialect,
            host: url.host,
            port: url.port && parseInt(url.port),
            user: url.username,
            password: url.password,
            database: url.pathname.split('|')[0],
            ...urlOptions,
          };
        } catch (error) {
          throw new Error('Unregister or uninstalled dialect: ' + dialect);
        }
      }
    } else {
      options = optionOrUrlOrConfigname;
    }
  }

  options = Object.assign({}, defaultConnectOptions, options);

  assert(
    options.driver || options.dialect,
    'One of the dialect and driver must be specified.'
  );

  if (!options.driver) {
    try {
      const driver = dialects[options.dialect];
      if (typeof driver === 'string') {
        options.driver = require(driver);
      } else {
        options.driver = driver;
      }
    } catch (err) {
      throw new Error('Unsupported dialect or driver not installed.' + err);
    }
  }

  const provider: DbProvider = await options.driver(options);
  return new Lube(provider);
}

const OPTIONS_FILE = '.lubejs';

async function loadConfig(): Promise<LubeConfig> {
  let configFile = join(process.cwd(), OPTIONS_FILE);
  if (existsSync(configFile + '.js')) {
    configFile = configFile + '.js';
  } else if (existsSync(configFile + '.ts')) {
    configFile = configFile + '.ts';
  } else {
    console.error(
      `Configure file '.lubejs(.ts|.js)' not found in dir ${process.cwd()}.`
        .red,
      'Please use options or url to connect.'
    );
    return;
  }
  let config: LubeConfig;
  try {
    const imported = await import(configFile);
    config = imported?.default ?? imported;
  } catch (error) {
    console.error(`Occur error at load configure ${configFile}`, error);
    return;
  }
  return config;
}

/**
 * 使用全局Lube创建，适用于一个Lube对象，多个DbContext的情况
 */
export async function createContext<T extends DbContext>(
  configName?: string
): Promise<T>;
export async function createContext<T extends DbContext>(
  Ctr: DbContextConstructor<T>,
  lube: Lube
): Promise<T>;
export async function createContext<T extends DbContext>(
  Ctr: DbContextConstructor<T>,
  optOrUrlOrName?: ConnectOptions | string
): Promise<T>;
export async function createContext<T extends DbContext>(
  nameOrCtr?: DbContextConstructor<T> | string,
  optOrUrlOrLube?: ConnectOptions | string | Lube
): Promise<T> {
  // if (typeof Ctr === 'function' && optOrUrlOrLube instanceof Lube) return Ctr(optOrUrlOrLube);
  let config: LubeConfig;
  let error: Error;
  try {
    config = await loadConfig();
  } catch (err) {
    error = err;
  }

  let Ctr: DbContextConstructor<T>;
  if (!nameOrCtr) {
    if (!config) throw error;
    Ctr = metadataStore.defaultContext?.class as DbContextConstructor<T>;
  } else if (typeof nameOrCtr === 'string') {
    if (!config) throw error;
    Ctr = metadataStore.getContext(nameOrCtr)?.class as DbContextConstructor<T>;
  }

  if (!Ctr)
    throw new Error(
      `Context not found or DbContext no register, pls register DbContext in Front position of config file.`
    );

  if (optOrUrlOrLube instanceof Lube) {
    return new Ctr(optOrUrlOrLube);
  }

  let lube: Lube;
  if (!optOrUrlOrLube && optOrUrlOrLube !== '') {
    if (!config) throw error;
    const options = config?.configures?.[Ctr.name];
    if (!options) {
      throw new Error(`DbContext ${Ctr.name} options not found.`);
    }
    lube = await connect(options);
  } else {
    if (optOrUrlOrLube === '')
      throw new Error(`Configure name or url is not allow empty string.`);
    lube = await connect(optOrUrlOrLube);
  }
  return new Ctr(lube);
}

/**
 * 注册一个方言支持
 * @param driver 驱动可以是connect函数，亦可以是npm包或路径
 */
export async function register(
  name: string,
  driver: Driver | string
): Promise<void> {
  if (dialects[name]) {
    throw new Error(`Driver ${name} is exists.`);
  }
  dialects[name] = driver;
}

export const dialects: Record<string, Driver | string> = {
  mssql: 'lubejs-mssql',
};

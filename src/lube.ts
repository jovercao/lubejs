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
import { isUrl, parseConnectionUrl } from './util';

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
  database?: string;
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
  readonly options: ConnectOptions;
  readonly sqlUtil: SqlUtil;
  readonly migrateBuilder: MigrateBuilder;
  query(sql: string, params?: Parameter[]): Promise<QueryResult<any, any, any>>;
  beginTrans(isolationLevel: ISOLATION_LEVEL): Promise<Transaction>;
  /**
   * 重新选择数据库
   * 注意：如果数据连接已经打开，则此操作会重新连接数据库。
   * @param database
   */
  changeDatabase(database: string | null): void;
  open(): Promise<void>;
  close(): Promise<void>;
  readonly opened: boolean;
  /**
   * 方言名称，如'mssql', 'mysql', 'oracle'
   */
  readonly dialect: string;

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
  getSchema(dbname?: string): Promise<DatabaseSchema | undefined>;

  /**
   * 获取当前连接的数据库名称
   */
  getCurrentDatabase(): Promise<string>;

  /**
   * 获取当前连接的默认架构
   */
  getDefaultSchema(database?: string): Promise<string>;
}

/**
 * 驱动程序
 * 实际上为一个工厂函数，通过实现该方法来扩展驱动支持
 */
export interface Driver {
  (config: ConnectOptions): DbProvider;
}

/**
 * 数据库事务
 */
export interface Transaction {
  query(sql: string, params?: Parameter[]): Promise<QueryResult<any, any, any>>;
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
      // HACK: 本该写在mssql库中的，但是由于这是mssql库的bug只能写在这里
      if (ex?.code === 'EREQINPROG') {
        throw new Error(`mssql driver error.`);
      }
      if (!canceled) {
        await abort();
      }
      throw ex;
    }
  }

  get opened() {
    return this.provider.opened;
  }

  getCurrentDatabase(): Promise<string> {
    return this.provider.getCurrentDatabase();
  }

  /**
   * 变更所在数据库
   * 当为null时表示登录用户默认数据库
   */
  changeDatabase(database: string | null): void {
    return this.provider.changeDatabase(database);
  }

  open(): Promise<void> {
    return this.provider.open();
  }

  close(): Promise<void> {
    return this.provider.close();
  }
}

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function createLube(cfgOrUrl?: string): Promise<Lube>;
export async function createLube(options: ConnectOptions): Promise<Lube>;
export async function createLube(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<Lube>;
export async function createLube(
  optOrUrlOrCfg?: ConnectOptions | string
): Promise<Lube> {
  let options: ConnectOptions;
  options = await getConnectOptions(optOrUrlOrCfg);
  const provider: DbProvider = options.driver!(options);
  const lube = new Lube(provider);
  // await lube.open();
  return lube;
}

const OPTIONS_FILE = '.lubejs';

export async function loadConfig(): Promise<LubeConfig> {
  let configFile = join(process.cwd(), OPTIONS_FILE);
  if (existsSync(configFile + '.js')) {
    configFile = configFile + '.js';
  } else if (existsSync(configFile + '.ts')) {
    configFile = configFile + '.ts';
  } else {
    throw new Error(`Configure file '.lubejs(.ts|.js)' not found in dir ${process.cwd()}, use 'lube init' to create it.`)
  }
  let config: LubeConfig;
  try {
    const imported = await import(configFile);
    config = imported?.default ?? imported;
  } catch (error) {
    throw new Error(`Occur error at load configure ${configFile}, error info: ${error}`);
  }
  return config;
}

async function getConnectOptions(opt?: ConnectOptions | string | DbContextConstructor): Promise<ConnectOptions> {
  let options: ConnectOptions | undefined;
  if (typeof opt === 'object') {
    options = opt;
  } else if (typeof opt === 'string') {
    options = parseConnectionUrl(opt);
  } else {
    const config = await loadConfig();
    if (!config) {
      throw new Error(`Configure file '.lubejs.ts' or '.lubejs.js' not found.`);
    }
    if (!opt) {
      options = config.configures[config.default];
      if (!options) {
        throw new Error(`Default options not found in configure file`);
      }
    } else {
      options = config.configures[opt.name];
      if (!options) {
        options = metadataStore.getContext(opt).connection;
      }
      if (!options) {
        throw new Error(`Option ${opt.name} not found in configure file.`);
      }
    }
  }

  if (!options.driver) {
    if(!options.dialect) {
      throw new Error('ConnectOptions must provide one of dialect or dirver');
    }
    const driver = dialects[options.dialect];
    if (!driver) {
      throw new Error(`Unregister dialect ${options.dialect}.`);
    }
    options.driver = driver;
  }
  return options;
}

/**
 * 使用全局Lube创建，适用于一个Lube对象，多个DbContext的情况
 */

/**
 * 创建默认DbContext，其值为已注册的默认context类实例
 * 如未有注册Context则抛出异常
 */
export async function createContext(): Promise<DbContext>
/**
 * 通过配置创建一个DbContext，其值为已注册的默认context类实例
 * 如未有注册Context则抛出异常
 */
export async function createContext(
  optOrCfgOrUrlOrLube?: ConnectOptions | string | Lube
): Promise<DbContext>;

export async function createContext<T extends DbContext>(
  Ctr: DbContextConstructor<T>,
  optOrCfgOrUrlOrLube?: Lube | ConnectOptions | string
): Promise<T>;

export async function createContext(
  optOrCfgOrUrlOrLubeOrCtr?: DbContextConstructor | ConnectOptions | string | Lube,
  optOrCfgOrUrlOrLube?: ConnectOptions | string | Lube
): Promise<DbContext> {
  // if (typeof Ctr === 'function' && optOrUrlOrLube instanceof Lube) return Ctr(optOrUrlOrLube);
  let Ctr: DbContextConstructor;
  let lube: Lube;
  if (!optOrCfgOrUrlOrLubeOrCtr) {
    Ctr = metadataStore.defaultContext.class
    const options = await getConnectOptions(Ctr);
    // if (!options) {
    //   throw new Error(`Context ${Ctr.name} 's config not found in configure file, pls configure it or provider options.`)
    // }
    lube = await createLube(options);
  } else if (typeof optOrCfgOrUrlOrLubeOrCtr === 'function') {
    Ctr = optOrCfgOrUrlOrLubeOrCtr;
    if (!optOrCfgOrUrlOrLube) {
      const options = await getConnectOptions(Ctr)
      lube = await createLube(options);
    } else if (optOrCfgOrUrlOrLube instanceof Lube) {
      lube = optOrCfgOrUrlOrLube
    } else {
      const options = await getConnectOptions(optOrCfgOrUrlOrLube);
      lube = await createLube(options);
    }
  } else if (optOrCfgOrUrlOrLubeOrCtr instanceof Lube) {
    Ctr = metadataStore.defaultContext.class;
    lube = optOrCfgOrUrlOrLubeOrCtr;
  } else {
    Ctr = metadataStore.defaultContext.class;
    const options = await getConnectOptions(optOrCfgOrUrlOrLubeOrCtr)
    lube = await createLube(options);
  }

  return new Ctr(lube);
}

/**
 * 注册一个方言支持
 * @param driver 驱动可以是connect函数，亦可以是npm包或路径
 */
export async function register(
  name: string,
  driver: Driver
): Promise<void> {
  if (dialects[name]) {
    throw new Error(`Driver ${name} is exists.`);
  }
  dialects[name] = driver;
}

export const dialects: Record<string, Driver> = {

};

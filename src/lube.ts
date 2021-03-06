import { Executor, QueryResult } from "./executor";
import { Compiler, CompileOptions } from "./compiler";
import { URL } from "url";
import { ISOLATION_LEVEL } from "./constants";
import * as assert from "assert";
import { Parameter } from "./ast";

export type TransactionHandler = (
  executor: Executor,
  abort: () => Promise<void>
) => Promise<any>;

/**
 * 数据库事务
 */
export interface ITransaction {
  query(sql: string, params: Parameter[]): Promise<QueryResult>;
  commit(): void;
  rollback(): void;
}

/**
 * 数据库提供驱动程序
 */
export interface IDbProvider {
  /**
   * 必须实现编译器
   */
  compiler: Compiler;
  query(sql: string, params: Parameter[]): Promise<QueryResult>;
  beginTrans(isolationLevel: ISOLATION_LEVEL): ITransaction;
  close(): Promise<void>;
}

/**
 * 驱动入口，通过实现该方法来扩展
 */
export interface Driver {
  (config: ConnectOptions): IDbProvider
}

export class Lube extends Executor {
  private _provider: IDbProvider;

  constructor(provider: IDbProvider, options: ConnectOptions) {
    let compiler = provider.compiler;
    // if (!compiler) {
    //   let compileOptions: CompileOptions = {};
    //   if (options.strict !== undefined) {
    //     compileOptions.strict = options.strict;
    //   }
    //   compiler = new Compiler(compileOptions);
    // }
    super(function (...args) {
      return provider.query(...args);
    }, compiler);
    this._provider = provider;
  }

  /**
   * 开启一个事务并自动提交
   * @param {*} handler (exeutor, cancel) => false
   * @param {*} isolationLevel 事务隔离级别
   */
  async trans(
    handler: TransactionHandler,
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ) {
    if (this.isTrans) {
      throw new Error("is in transaction now");
    }
    let canceled = false;
    const { query, commit, rollback } = await this._provider.beginTrans(
      isolationLevel
    );
    const executor = new Executor(query, this.compiler, true);
    const abort = async () => {
      canceled = true;
      await rollback();
      executor.emit("rollback", executor);
    };
    const complete = async () => {
      await commit();
      executor.emit("commit", executor);
    };
    executor.on("command", (cmd) => this.emit("command", cmd));
    executor.on("error", (cmd) => this.emit("error", cmd));
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

  async close() {
    await this._provider.close();
  }
}

export type ConnectOptions = {
  /**
   * 数据库方言，必须安装相应的驱动才可正常使用
   */
  dialect?: string;
  /**
   * 驱动程序，与dialect二选一，优先使用driver
   */
  driver?: Driver;
  host: string;
  port?: number;
  user: string;
  password: string;
  database: string;
  poolMax: number;
  poolMin: number;
  idelTimeout: number;
  /**
   * 其它配置项，针对各种数据的专门配置
   */
  [key: string]: any;
} & Pick<CompileOptions, 'strict' | 'returnParameterName'>

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function connect(url: string): Promise<Lube>;
export async function connect(config: ConnectOptions): Promise<Lube>;
export async function connect(arg: ConnectOptions | string): Promise<Lube> {
  let config: ConnectOptions;
  if (typeof arg === "string") {
    const url = new URL(arg);
    const params = url.searchParams;
    const options: any = {
      poolMax: 100,
      // 最低保持0个连接
      poolMin: 0,
      // 连接闲置关闭等待时间
      idelTimeout: 30,
    };
    for (const [key, value] of params.entries()) {
      if (value !== undefined) {
        options[key] = value;
      }
    }
    const dialect = url.protocol
      .substr(0, url.protocol.length - 1)
      .toLowerCase();
    try {
      config = {
        dialect,
        host: url.host,
        port: url.port && parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.split("|")[0],
        ...options,
      };
    } catch (error) {
      throw new Error("Unsupport or uninstalled dialect: " + dialect);
    }
  } else {
    config = arg;
  }

  assert(
    config.driver || config.dialect,
    "One of the dialect and driver items must be specified."
  );

  if (!config.driver) {
    try {
      const driver = dialects[config.dialect]
      if (typeof driver === 'string') {
        config.driver = require(driver);
      } else {
        config.driver = driver
      }
    } catch (err) {
      throw new Error("Unsupported dialect or driver not installed." + err);
    }
  }

  const provider: IDbProvider = await config.driver(config);
  return new Lube(provider, config);
}

const dialects: Record<string, Driver | string> = {
  mssql: 'lubejs-mssql'
}

/**
 * 注册一个方言支持
 * @param driver 驱动可以是connect函数，亦可以是npm包或路径
 */
export async function register(name: string, driver: Driver | string) {
  if (dialects[name]) {
    throw new Error(`Driver ${name} is exists.`)
  }
  dialects[name] = driver
}

export * from "./builder";

export * from "./constants";

export * from "./ast";

export * from "./compiler";

export * from "./executor";

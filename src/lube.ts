/* eslint-disable @typescript-eslint/no-explicit-any */
import { Executor } from "./executor";
import { URL } from "url";
import { ISOLATION_LEVEL } from "./constants";
import * as assert from "assert"
import { dialects } from "./dialects";
import { CompileOptions, ConnectOptions, IDbProvider, TransactionHandler } from "./types";

export class Lube extends Executor {
  private provider: IDbProvider;

  constructor(provider: IDbProvider) {
    const compiler = provider.compiler;
    // if (!compiler) {
    //   let compileOptions: CompileOptions = {};
    //   if (options.strict !== undefined) {
    //     compileOptions.strict = options.strict;
    //   }
    //   compiler = new Compiler(compileOptions);
    // }
    super(function (...args: any[]) {
      return provider.query.call(provider, ...args);
    }, compiler);
    this.provider = provider;
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
      throw new Error("is in transaction now");
    }
    let canceled = false;
    const { query, commit, rollback } = await this.provider.beginTrans(
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
  return new Lube(provider);
}


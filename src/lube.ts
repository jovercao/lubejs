/* eslint-disable @typescript-eslint/no-explicit-any */
import { Executor, QueryResult } from './execute'
import { URL } from 'url'
import { ISOLATION_LEVEL } from './constants'
import * as assert from 'assert'
import { CompileOptions, Compiler } from './compile'
import { Parameter } from './ast'

export type ConnectOptions = {
  /**
   * 数据库方言(必须是已注册的言)，与driver二选一，必须安装相应的驱动才可正常使用
   */
  dialect?: string
  /**
   * 驱动程序，与dialect二选一，优先使用driver
   */
  driver?: Driver
  /**
   * 主机名
   */
  host: string
  /**
   * 端口号
   */
  port?: number
  /**
   * 连接用户名
   */
  user: string
  /**
   * 密码
   */
  password: string
  /**
   * 数据库名称
   */
  database: string
  /**
   * 连接池最大连接数，单位为秒
   */
  maxConnections: number
  /**
   * 连接池最小连接数，默认为1
   */
  minConnections: number
  /**
   * 连接超时时长，单位: ms，默认为15000ms
   */
  connectionTimeout?: number
  /**
   * 单个查询超时时长,单位: ms，默认为15000ms
   */
  requestTimeout?: number
  /**
   * 回收未使用的连接等待时长，单位: ms，默认为30000ms
   */
  recoveryConnection: number
  /**
   * 编译选项
   */
  compileOptions?: CompileOptions
}

const defaultConnectOptions: Partial<ConnectOptions> = {
  connectionTimeout: 30,
  requestTimeout: 10 * 60,
  minConnections: 0,
  maxConnections: 5,
}

export type TransactionHandler<T> = (
  executor: Executor,
  abort: () => Promise<void>
) => Promise<T>

/**
 * 数据库提供驱动程序
 */
export interface IDbProvider {
  /**
   * 必须实现编译器
   */
  // getCompiler(options: CompileOptions): Compiler;
  readonly compiler: Compiler
  query(sql: string, params: Parameter[]): Promise<QueryResult<any, any, any>>
  beginTrans(isolationLevel: ISOLATION_LEVEL): Promise<Transaction>
  close(): Promise<void>
}

/**
 * 驱动程序
 * 实际上为一个工厂函数，通过实现该方法来扩展驱动支持
 */
export interface Driver {
  (config: ConnectOptions): Promise<IDbProvider>
}

/**
 * 数据库事务
 */
export interface Transaction {
  query(sql: string, params: Parameter[]): Promise<QueryResult<any, any, any>>
  commit(): Promise<void>
  rollback(): Promise<void>
}

export class Lube extends Executor {
  private provider: IDbProvider

  constructor (provider: IDbProvider) {
    const compiler = provider.compiler
    // if (!compiler) {
    //   let compileOptions: CompileOptions = {};
    //   if (options.strict !== undefined) {
    //     compileOptions.strict = options.strict;
    //   }
    //   compiler = new Compiler(compileOptions);
    // }
    super(function (...args: any[]) {
      return provider.query.call(provider, ...args)
    }, compiler)
    this.provider = provider
  }

  /**
   * 开启一个事务并自动提交
   * @param {*} handler (exeutor, cancel) => false
   * @param {*} isolationLevel 事务隔离级别
   */
  async trans<T> (
    handler: TransactionHandler<T>,
    isolationLevel: ISOLATION_LEVEL = ISOLATION_LEVEL.READ_COMMIT
  ): Promise<T> {
    if (this.isTrans) {
      throw new Error('is in transaction now')
    }
    let canceled = false
    const { query, commit, rollback } = await this.provider.beginTrans(
      isolationLevel
    )
    const executor = new Executor(query, this.compiler, true)
    const abort = async () => {
      canceled = true
      await rollback()
      executor.emit('rollback', executor)
    }
    const complete = async () => {
      await commit()
      executor.emit('commit', executor)
    }
    executor.on('command', cmd => this._emitter.emit('command', cmd))
    executor.on('error', cmd => this._emitter.emit('error', cmd))
    try {
      const res = await handler(executor, abort)
      if (!canceled) {
        await complete()
      }
      return res
    } catch (ex) {
      if (!canceled) {
        await abort()
      }
      throw ex
    }
  }

  async close (): Promise<void> {
    await this.provider.close()
  }
}

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function connect (url: string): Promise<Lube>
export async function connect (options: ConnectOptions): Promise<Lube>
export async function connect (arg: ConnectOptions | string): Promise<Lube> {
  let config: ConnectOptions
  if (typeof arg === 'string') {
    const url = new URL(arg)
    const params = url.searchParams
    const options: any = {
      poolMax: 100,
      // 最低保持0个连接
      poolMin: 0,
      // 连接闲置关闭等待时间
      idelTimeout: 30
    }
    for (const [key, value] of params.entries()) {
      if (value !== undefined) {
        options[key] = value
      }
    }
    const dialect = url.protocol
      .substr(0, url.protocol.length - 1)
      .toLowerCase()
    try {
      config = {
        dialect,
        host: url.host,
        port: url.port && parseInt(url.port),
        user: url.username,
        password: url.password,
        database: url.pathname.split('|')[0],
        ...options
      }
    } catch (error) {
      throw new Error('Unregister or uninstalled dialect: ' + dialect)
    }
  } else {
    config = Object.assign({}, defaultConnectOptions, arg)
  }

  assert(
    config.driver || config.dialect,
    'One of the dialect and driver must be specified.'
  )

  if (!config.driver) {
    try {
      const driver = dialects[config.dialect]
      if (typeof driver === 'string') {
        config.driver = require(driver)
      } else {
        config.driver = driver
      }
    } catch (err) {
      throw new Error('Unsupported dialect or driver not installed.' + err)
    }
  }

  const provider: IDbProvider = await config.driver(config)
  return new Lube(provider)
}

/**
 * 注册一个方言支持
 * @param driver 驱动可以是connect函数，亦可以是npm包或路径
 */
export async function register (
  name: string,
  driver: Driver | string
): Promise<void> {
  if (dialects[name]) {
    throw new Error(`Driver ${name} is exists.`)
  }
  dialects[name] = driver
}

export const dialects: Record<string, Driver | string> = {
  mssql: 'lubejs-mssql'
}

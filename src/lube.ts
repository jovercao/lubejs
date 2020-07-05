import { Executor, QueryResult } from './executor'
import { Parser, Ployfill } from './parser'
import { URL } from 'url'
import * as _ from 'lodash'
import { IsolationLevel } from './constants'
import { assert } from 'console'

export type TransactionHandler = (executor: Executor, abort: () => Promise<void>) => Promise<any>

/**
 * 数据库事务
 */
export interface ITransaction {
  query(): Promise<QueryResult>
  commit(): void
  rollback(): void
}

/**
 * 数据库提供驱动程序
 */
export interface IDbProvider {
  ployfill?: Ployfill
  parser?: Parser
  query(sql, params): Promise<QueryResult>
  beginTrans(isolationLevel: IsolationLevel): ITransaction
  close(): Promise<void>
}

export class Lube extends Executor {
  private _provider: IDbProvider

  constructor(provider: IDbProvider, options) {
    let parser = provider.parser
    if (!parser) {
      parser = new Parser(provider.ployfill, options)
    }
    super(function (...args) {
      return provider.query(...args)
    }, parser)
    this._provider = provider
  }

  /**
   * 开启一个事务并自动提交
   * @param {*} handler (exeutor, cancel) => false
   * @param {*} isolationLevel 事务隔离级别
   */
  async trans(handler: TransactionHandler, isolationLevel) {
    if (this.isTrans) {
      throw new Error('is in transaction now')
    }
    let canceled = false
    const { query, commit, rollback } = await this._provider.beginTrans(isolationLevel)
    const abort = async function () {
      canceled = true
      await rollback()
    }
    const executor = new Executor(query, this.parser, true)
    executor.on('command', cmd => this.emit('command', cmd))
    executor.on('error', cmd => this.emit('error', cmd))
    try {
      const res = await handler(executor, abort)
      if (!canceled) {
        await commit()
      }
      return res
    } catch (ex) {
      if (!canceled) {
        await rollback()
      }
      throw ex
    }
  }

  async close() {
    await this._provider.close()
  }
}

interface ConnectOptions {
  /**
   * 数据库方言，必须安装相应的驱动才可正常使用
   */
  dialect?: string
  /**
   * 驱动程序，与dialect二选一
   */
  driver?: ((config: ConnectOptions) => IDbProvider)
  host: string
  port?: number
  user: string
  password: string
  database: string
  poolMax: number
  poolMin: number
  idelTimeout: number
}

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
export async function connect(url: string): Promise<Lube>
export async function connect(config: ConnectOptions): Promise<Lube>
export async function connect(arg: ConnectOptions | string): Promise<Lube> {
  let config: ConnectOptions
  if (typeof arg === 'string') {
    const url = new URL(arg)
    const params = url.searchParams
    const options = {
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
    const dialect = url.protocol.substr(0, url.protocol.length - 1).toLowerCase()
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
    } catch(error) {
      throw new Error('Unsupport or uninstalled dialect: ' + dialect)
    }
  } else {
    config = arg
  }

  assert(config.driver || config.dialect, 'One of the dialect and driver items must be specified.')

  if (!config.driver) {
    try {
      config.driver = require('lubejs-' + config.dialect)
    } catch (err) {
      throw new Error('Unsupported dialect or driver not installed.')
    }
  }

  const provider: IDbProvider = await config.driver(config)
  return new Lube(provider, config)
}

export * from './builder'


export {
  IsolationLevel,
  ParameterDirection,
  SortDirection
} from './constants'

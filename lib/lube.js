const { Executor } = require('./executor')
const { Compiler } = require('./compiler')
const { URL } = require('url')
const builder = require('./builder')
const { EventEmitter } = require('events')
const { assert } = require('./util')
const _ = require('lodash')
const { SqlSymbolMapps } = require('./constants')

class Lube extends EventEmitter {
  constructor(provider, ployfill, options) {
    super()
    assert(provider, 'provider is required.')
    assert(_.isFunction(provider.query), 'provider must provide function: query')
    assert(_.isFunction(provider.beginTrans), 'provider must provide function: beginTrans')

    this._provider = provider
    this._compiler = new Compiler(ployfill, options)
    const query = function (...args) {
      return provider.query(...args)
    }
    this._executor = new Executor(
      query,
      this._compiler,
      false
    )

    this._executor.on('error', err => this.emit('error', err))
    this._executor.on('command', cmd => this.emit('command', cmd))

    // 复制主要方法到lube对象
    for (const fn of ['insert', 'find', 'query', 'select', 'update', 'delete', 'execute', 'first', 'scalar']) {
      this[fn] = function (...args) {
        return this._executor[fn](...args)
      }
    }
  }

  /**
   * 开启一个事务并自动提交
   * @param {*} handler (exeutor, cancel) => false
   * @param {*} isolationLevel 事务隔离级别
   */
  async trans(handler, isolationLevel) {
    let canceled = false
    const { query, commit, rollback } = await this._provider.beginTrans(isolationLevel)
    const abort = async function () {
      await rollback()
      canceled = true
    }
    const executor = new Executor(query, this._compiler, true)
    // TODO: 今天做到这里
    executor.on('command', cmd => this.emit('command', cmd))
    executor.on('error', cmd => this.emit('error', cmd))
    try {
      const res = await handler(executor, abort)
      if (!canceled) {
        await commit()
        executor.emit('commit')
      }
      return res
    } catch (ex) {
      if (!canceled) {
        await rollback()
        executor.emit('rollback')
      }
      throw ex
    }
  }

  async close() {
    await this._provider.close()
  }
}

/**
 * 连接数据库并返回一个连接池
 * @param {*} config
 */
async function connect(config) {
  if (typeof config === 'string') {
    const url = new URL(config)
    const params = url.searchParams
    const options = {
      poolMax: 100,
      // 最低保持0个连接
      poolMin: 0,
      // 连接闲置关闭等待时间
      idelTimeout: 30
    }

    params.entries().forEach(([key, value]) => { value !== undefined && (options[key] = value) })
    config = {
      dialetc: url.protocol.substr(0, url.protocol.length - 1).toLowerCase(),
      host: url.host,
      port: url.port || undefined,
      user: url.username,
      password: url.password,
      database: url.pathname.split('|')[0] || undefined,
      ...options
    }
  }

  let provider
  switch (config.dialect) {
    case 'oracle':
      provider = await require('./oracle').connect(config)
      break
    case 'mssql':
      provider = await require('./mssql').connect(config)
      break
    default:
      throw new Error('not support dialetc')
  }

  return new Lube(provider, provider.ployfill, config)
}

module.exports = {
  connect,
  ...builder,
  Op: SqlSymbolMapps
}

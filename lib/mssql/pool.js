const { EventEmitter } = require('events')
const { Executor } = require('./executor')
const mssql = require('mssql')
const { IsolationLevel } = require('../constants')

const IsolationLevelMap = {
  [IsolationLevel.readCommitted]: mssql.ISOLATION_LEVEL.READ_COMMITTED,
  [IsolationLevel.readUncommitted]: mssql.ISOLATION_LEVEL.READ_UNCOMMITTED,
  [IsolationLevel.repeatableRead]: mssql.ISOLATION_LEVEL.REPEATABLE_READ,
  [IsolationLevel.serializable]: mssql.ISOLATION_LEVEL.SERIALIZABLE,
  [IsolationLevel.snapshot]: mssql.ISOLATION_LEVEL.SNAPSHOT
}

class Pool extends EventEmitter {
  constructor(pool, options) {
    super()
    this._options = options
    this._executor = new Executor(pool, options)
    this._pool = pool
    pool.warp = this
    this._executor.on('command', cmd => this.emit('command', cmd))
    this._executor.on('error', cmd => this.emit('error', cmd))
  }

  query(sql, params) {
    return this._executor.query(...arguments)
  }

  insert(table, row) {
    return this._executor.insert(...arguments)
  }

  find(table, where) {
    return this._executor.find(...arguments)
  }

  select(table, { where, orders, limit, offset, fields } = {}) {
    return this._executor.select(...arguments)
  }

  update(table, sets, where) {
    return this._executor.update(...arguments)
  }

  delete(table, where) {
    return this._executor.delete(...arguments)
  }

  async trans(handler, isolationLevel) {
    let canceled = false
    const trans = this._pool.transaction()
    const abort = async function () {
      canceled = true
      await trans.rollback()
    }
    const executor = new Executor(trans, this._options, true)
    executor.on('command', cmd => this.emit('command', cmd))
    executor.on('error', cmd => this.emit('error', cmd))
    await trans.begin(IsolationLevelMap[isolationLevel] || mssql.ISOLATION_LEVEL.READ_COMMITTED)
    try {
      await handler(executor, abort)
      if (!canceled) {
        await trans.commit()
      }
    } catch (ex) {
      if (!canceled) {
        await trans.rollback()
      }
      throw ex
    }
  }

  /**
   * 关闭所有连接
   * @memberof Pool
   */
  async close() {
    await this._pool.close()
  }
}

module.exports = {
  Pool
}

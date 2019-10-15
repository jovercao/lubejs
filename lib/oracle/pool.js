const { Connection } = require('./connection')
const { EventEmitter } = require('events')

class Pool extends EventEmitter {
  constructor(pool, options) {
    super()
    this._pool = pool
    this._options = options
  }

  async _getConnection() {
    const connection = await this._pool.getConnection({
      privilege: this._options.privilege
    })
    const conn = new Connection(connection)
    conn.on('execute', (...args) => this.emit('execute', ...args))
    conn.on('error', (...args) => this.emit('error', ...args))
    return conn
  }

  async close() {
    // 5分钟关闭时间
    const drainTime = 5 * 60
    await this._pool.close(drainTime)
  }

  async _runWithConnection(method, params) {
    const conn = await this._getConnection()
    try {
      const res = await conn[method](...params)
      return res
    } finally {
      conn.close()
    }
  }

  query(sql, params) {
    return this._runWithConnection('query', arguments)
  }

  find(table, where) {
    return this._runWithConnection('find', arguments)
  }

  insert(table, row) {
    return this._runWithConnection('insert', arguments)
  }

  update(table, row, where) {
    return this._runWithConnection('update', arguments)
  }

  delete(table, where) {
    return this._runWithConnection('delete', arguments)
  }

  select(table, options) {
    return this._runWithConnection('select', arguments)
  }

  execute(sp, params) {
    return this._runWithConnection('execute', arguments)
  }

  async trans(handler, isolevel) {
    const conn = await this._getConnection()
    await conn.beginTrans(isolevel)
    try {
      await handler(conn)
      conn.commit()
    } finally {
      await conn.rollback()
      await conn.close()
    }
  }
}

module.exports = {
  Pool
}

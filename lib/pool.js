const { Connection } = require('./connection')

class Pool {
  constructor(pool) {
    this._pool = pool
  }

  async getConnection() {
    const connection = await this._pool.getConnection()
    return new Connection(connection)
  }

  async close() {
    // 5分钟关闭时间
    const drainTime = 5 * 60
    await this._pool.close(drainTime)
  }
}

module.exports = {
  Pool
}

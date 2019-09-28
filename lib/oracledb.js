const oracledb = require('oracledb')
const { Connection } = require('./connection')
const { Pool } = require('./pool')

module.exports = {

  async createPool(config) {
    const pool = await oracledb.createPool(config)
    pool.close()
    return new Pool(pool)
  },

  async createConnection(config) {
    const connection = await oracledb.getConnection(config)
    return new Connection(connection)
  }
}

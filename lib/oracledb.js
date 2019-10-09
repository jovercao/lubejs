const oracledb = require('oracledb')
const { Connection } = require('./connection')
const { Pool } = require('./pool')
const { Condition } = require('./condition')
const { NULL, Operators } = require('./constants')

module.exports = {
  async createPool(config) {
    const pool = await oracledb.createPool(config)
    pool.close()
    return new Pool(pool)
  },

  async connect(config) {
    const connection = await oracledb.getConnection(config)
    return new Connection(connection)
  },
  Condition,
  Operators,
  Provider: oracledb
}

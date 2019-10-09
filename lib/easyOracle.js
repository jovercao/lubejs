const oracledb = require('oracledb')
const { Connection } = require('./connection')
const { Pool } = require('./pool')
const { Condition } = require('./condition')

module.exports = {
  async createPool(config) {
    const pool = await oracledb.createPool(config)
    return new Pool(pool)
  },

  async connect(config) {
    const connection = await oracledb.getConnection(config)
    return new Connection(connection)
  },
  Condition,
  field: Condition.field,
  not: Condition.not,
  Provider: oracledb
}

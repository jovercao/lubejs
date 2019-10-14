const oracledb = require('oracledb')
const { Pool } = require('./pool')
const { Connection } = require('./oracle/connection')

module.exports = {
  createPool(config) {
    const pool = await oracledb.createPool(config)
    return new Pool(pool)
  },
  connect(config) {
    const connection = await oracledb.getConnection(config)
    return new Connection(connection)
  }
}

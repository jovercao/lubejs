const oracledb = require('oracledb')
const { Pool } = require('./pool')
const { Connection } = require('./connection')

function normalConfig(config) {
  if (!config.connectString) {
    config.connectString = config.host + ':' + (config.port || 1521) + '/' + config.database
  }
  return config
}

module.exports = {
  async createPool(config) {
    const pool = await oracledb.createPool(normalConfig(config))
    return new Pool(pool)
  },
  async connect(config) {
    if (!config.connectString) {
      config.connectString = config.host + ':' + (config.port || 1521) + '/' + config.database
    }
    console.log(config)
    const connection = await oracledb.getConnection(normalConfig(config))
    return new Connection(connection)
  }
}

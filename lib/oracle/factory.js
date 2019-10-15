const oracledb = require('oracledb')
const { Pool } = require('./pool')

module.exports = async function createPool(config) {
  const options = {
    user: config.user,
    password: config.password,
    connectString: config.host + ':' + (config.port || 1521) + '/' + (config.database || config.ssid || config.serviceName),
    poolTimeout: config.options.idelTimeout,
    // 获取连接的最大排队等待时间，默认值10秒
    queueTimeout: 10000
  }

  if (config.options) {
    Object.assign(options, config.options)
  }

  const pool = await oracledb.createPool(options)
  return new Pool(pool, options)
}

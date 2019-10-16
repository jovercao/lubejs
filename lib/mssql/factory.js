const sql = require('mssql')
const { Pool } = require('./pool')

module.exports = async function connect(config) {
  const options = {
    server: (config.host + (config.instance ? '\\' + config.instance : '')) || 'localhost',
    pool: {
      max: config.poolMax || 10,
      min: config.poolMin || 0,
      idleTimeoutMillis: config.idleTimeoutMillis || 30000
    },
    // 请求超时时间
    requestTimeout: 60000,
    // 连接超时时间
    connectionTimeout: 15000,
    // 开启JSON
    parseJSON: true,
    // 严格模式
    strict: true
  }

  Object.assign(options, config)

  const pool = await sql.connect(options)
  return new Pool(pool, options)
}

const sql = require('mssql')
const { Provider } = require('./provider')

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

  const pool = new sql.ConnectionPool(options)
  await pool.connect()
  return new Provider(pool)
}

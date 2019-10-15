const sql = require('mssql')
const { Pool } = require('./pool')

module.exports = async function connect(config) {
  const options = {
    user: config.user,
    password: config.password,
    server: config.server || (config.host + (config.instance ? '\\' + config.instance : '')) || 'localhost',
    database: config.database,
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
    parseJSON: true
  }

  console.log(options)
  if (config.options) {
    Object.assign(options, config.options)
  }

  const pool = await sql.connect(options)
  return new Pool(pool, options)
}

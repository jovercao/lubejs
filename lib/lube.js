const Builder = require('./builder')
const { URL } = require('url')

module.exports = {
  /**
   * 连接数据库并返回一个连接池
   * @param {*} config
   */
  async connect(config) {
    if (typeof config === 'string') {
      const url = new URL(config)
      const params = url.searchParams
      const options = {
        poolMax: 100,
        // 最低保持0个连接
        poolMin: 0,
        // 连接闲置关闭等待时间
        idelTimeout: 30
      }

      params.entries().forEach(([key, value]) => { value !== undefined && (options[key] = value) })
      config = {
        dialetc: url.protocol.substr(0, url.protocol.length - 1).toLowerCase(),
        host: url.host,
        port: url.port || undefined,
        user: url.username,
        password: url.password,
        database: url.pathname.split('|')[0] || undefined,
        ...options
      }
    }

    switch (config.dialect) {
      case 'oracle':
        return require('./oracle/factory')(config)
      case 'mssql':
        return require('./mssql/factory')(config)
      default:
        throw new Error('not support dialetc')
    }
  },
  ...Builder
}

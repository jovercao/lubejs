const { Condition } = require('./condition')

module.exports = {
  async createPool(config) {
    switch (config.dialect) {
      case 'oracle':
        return require('./oracle/factory').createPool(config)
      case 'mssql':
        return require('./mssql/factory').createPool(config)
      default:
        throw new Error('not support driver')
    }
  },

  async connect(config) {
    switch (config.dialect) {
      case 'oracle':
        return require('./oracle/factory').connect(config)
      case 'mssql':
        return require('./mssql/factory').connect(config)
    }
  },
  Condition,
  field: Condition.field,
  not: Condition.not
}

const _ = require('lodash')
const { assert } = require('./util')
const { INPUT, OUTPUT } = require('./constants')

class Command {
  constructor(sql, params) {
    assert(!sql || _.isString(sql), 'sql must type of string.')
    assert(!params || _.isArray(params), 'params must type of array.')
    this._sql = sql
    this._params = params || []
  }

  _param(name, value, direction = INPUT) {
    this._params.push({
      name,
      value,
      direction
    })
    return this
  }

  input(name, value) {
    return this._param(name, value, INPUT)
  }

  output(name, value) {
    return this._param(name, value, OUTPUT)
  }

  get params() {
    return this._params
  }

  get sql() {
    return this._sql
  }

  set sql(sql) {
    this._sql = sql
  }
}

module.exports = {
  Command
}

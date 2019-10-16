const { EventEmitter } = require('events')
const { Condition } = require('../builder')
const assert = require('assert')
const mssql = require('mssql')
const _ = require('lodash')
const { OperatorMaps, CompareOperators, LogicJoinOperators, LogicNotOperator } = require('../constants')

class Executor extends EventEmitter {
  constructor(driver, options) {
    super()
    // 是否启用严格模式，避免关键字等问题
    this._driver = driver
    this._options = options
  }

  /**
   * 引括标识符，避免关键字被冲突问题
   * @param {string} identifier 标识符
   */
  _quoted (identifier) {
    if (this._options.strict) {
      return '[' + identifier + ']'
    } else {
      return identifier
    }
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} params 参数列表
   * @param {any} value 参数值
   */
  _appendParam(params, value) {
    if (!params.length) {
      params.length = 0
    }
    params.length++
    const paramName = '_P_' + params.length
    params[paramName] = value
    return '@' + paramName
  }

  /**
   * 编译Where查询条件为Sql
   * @param {*} where where条件
   * @param {array} params 用于接收参数值的数组
   * @returns string sql 返回Sql字符串
   * @memberof Pool
   */
  _compileWhere(where, params) {
    if (where instanceof Condition) {
      where = where.value
    }
    assert(where, 'where条件不能为空')
    // assert(_.isObject(where), 'where条件必须为object类型')
    // assert(params, '必须传递params用于接受参数')

    const keys = Object.keys(where)

    if (keys.length === 0) {
      throw new Error('查询条件不能为空')
    }

    // 默认and连接
    if (keys.length > 1) {
      // 转换为正常表达式
      return this._compileWhere({
        $and: Object.entries(where).map(([key, value]) => ({ [key]: value }))
      }, params)
    }

    // 针对正常化后表达式的解析
    const key = keys[0]
    const node = where[key]
    // 逻辑连接运算
    if (LogicJoinOperators.includes(key)) {
      const operator = OperatorMaps[key]
      assert(_.isArray(node), '逻辑运算符$and与$or的内容仅允许数组')
      assert(node.length >= 2, 'and 或者 or条件运算至少需要2个条件')
      return '(' + node.map(p => this._compileWhere(p, params)).join(' ' + operator + ' ') + ')'
    }
    // not 运算
    if (key === LogicNotOperator) {
      const operator = OperatorMaps[key]
      return `${operator} (${this._compileWhere(node, params)})`
    }

    // 如果属性值直接就是值类型，则说明是默认$eq运算
    if (!_.isPlainObject(node)) {
      // 默认等于操作
      return this._compileWhere({
        [key]: {
          $eq: node
        }
      }, params)
    }

    // 比较运算表达式
    assert(_.isPlainObject(node), `比较运算表达式${key}，必须为PlanObject`)
    const compareKeys = Object.keys(node)
    const operatorKey = compareKeys[0]
    assert(compareKeys.length === 1, `比较运算表达式${key}的对象仅允许拥有一个成员属性`)
    assert(CompareOperators.includes(operatorKey), `比较表达式运算符${operatorKey}不正确，运算符必须是${CompareOperators.join(',')}中的一种`)
    // sql 运算符
    const operator = OperatorMaps[operatorKey]
    const value = node[operatorKey]

    // 如果是in运算，则添加值列表
    if (operator === OperatorMaps.$in) {
      assert(_.isArray(value), 'IN 语句的参数必须为数组')
      assert(value.length < 50, '因为语句长度限制的原因，in语句的参数最大不能超过50个')
      return `${this._quoted(key)} ${operator} (${value.map(v => this._appendParam(params, v)).join(', ')})`
    }

    let paramName

    // NULL值不需要添加参数
    if (value === null) {
      paramName = 'NULL'
    } else {
      paramName = this._appendParam(params, value)
    }
    return `${this._quoted(key)} ${operator} ${paramName}`
  }

  async _query(sql, values) {
    assert(!_.isArray(values), 'MSSQL暂不支持匿名参数')

    this.emit('command', { sql, params: values })
    // 如果是模板字符串
    if (_.isArray(sql)) {
      const res = await this._driver.query(...arguments)
      return res
    }

    assert(_.isString(sql), 'sql 必须是字符串或者模板调用')

    const request = await this._driver.request()
    if (_.isPlainObject(values)) {
      for (const [key, value] of Object.entries(values)) {
        request.input(key, value)
      }
    }

    try {
      const res = await request.query(sql)
      return {
        rows: res.recordset,
        rowsAffected: res.rowsAffected[0]
      }
    } catch (ex) {
      this.emit('error', ex)
      throw ex
    }
  }

  async query(sql, params) {
    const res = await this._query(...arguments)
    return res
  }

  async insert(table, row) {
    assert(_.isString(table), 'table 参数必须为字符串')
    assert(row, 'row 不能为空')

    if (_.isArray(row)) {
      let rowsAffected = 0
      for (const r of row) {
        const count = await this.insert(table, r)
        rowsAffected += count
      }
      return rowsAffected
    }

    const params = {}
    const fields = Object.keys(row)
    const sql = `INSERT INTO ${this._quoted(table)}(${fields.map(f => this._quoted(f)).join(', ')}) VALUES(${fields.map(field => this._appendParam(params, row[field])).join(', ')})`
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async find(table, where) {
    const params = {}
    const sql = `SELECT TOP 1 * FROM ${this._quoted(table)} WHERE (${this._compileWhere(where, params)})`

    const res = await this._query(sql, params)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  async select(table, { where, orders, limit, offset, fields } = {}) {
    const params = {}
    let sql = `SELECT ${fields ? fields.map(f => this._quoted(f)).join(', ') : `${this._quoted(table)}.*`} FROM ${this._quoted(table)}`

    if (where) {
      sql += ` WHERE ${this._compileWhere(where, params)}`
    }
    if (orders) {
      sql += ` ORDER BY ${Object.entries(orders).map(([field, order]) => `${field} ${order}`).join(', ')}`
    }
    if (offset > 0) {
      sql += ` FETCH NEXT ${limit} ROWS`
    }

    const res = await this._query(sql, params)
    return res.rows
  }

  async update(table, sets, where) {
    const params = {}
    let sql = `UPDATE ${this._quoted(table)} SET ${Object.entries(sets).map(([field, value]) => `${this._quoted(field)} = ${this._appendParam(params, value)}`).join(', ')}`

    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async delete(table, where) {
    let sql = `DELETE ${this._quoted(table)}`
    const params = {}
    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }
}

module.exports = {
  Executor
}

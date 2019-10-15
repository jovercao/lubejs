const assert = require('assert')
const { Condition } = require('../builder')
const _ = require('lodash')
const { OperatorMaps, CompareOperators, LogicJoinOperators, LogicNotOperator } = require('../constants')
const { EventEmitter } = require('events')
const mssql = require('mssql')

class Pool extends EventEmitter {
  constructor(pool, options) {
    super()
    this._pool = pool
    this._options = options
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} params 参数列表
   * @param {any} value 参数值
   */
  _appendParam(request, value) {
    if (!request.length) {
      request.length = 0
    }
    request.length++
    const paramName = '_P_' + request.length
    request.input(paramName, value)
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
    assert(_.isObject(where), 'where条件必须为object类型')
    assert(params, '必须传递params用于接受参数')
    assert(params instanceof mssql.Request, 'params 必须是request')

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
      return `${key} ${operator} (${value.map(v => this._appendParam(params, v)).join(', ')})`
    }

    let paramName

    // NULL值不需要添加参数
    if (value === null) {
      paramName = 'NULL'
    } else {
      paramName = this._appendParam(params, value)
    }
    return `${key} ${operator} ${paramName}`
  }

  async _query(sql, values) {
    assert(!_.isArray(values), 'MSSQL暂不支持匿名参数')

    this.emit('execute', { sql, params: values })
    // 如果是模板字符串
    if (_.isArray(sql)) {
      const res = await this._pool.query(...arguments)
      return res
    }

    if (_.isString(sql) && !values) {
      const res = await this._pool.request(sql)
      return res
    }

    let request
    // 如果参数是request，内部使用
    if (values instanceof mssql.Request) {
      request = values
    }

    if (_.isPlainObject(values)) {
      request = await this._pool.request()
      Object.entries(values).forEach(([key, value]) => {
        request.input(key, value)
      })
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
      let rowsAffect = 0
      for (const r of row) {
        const count = await this.insert(table, r)
        rowsAffect += count
      }
      return rowsAffect
    }

    const params = this._pool.request()
    const fields = Object.keys(row)
    const sql = `INSERT INTO ${table}(${fields.join(', ')}) VALUES(${fields.map(field => this._appendParam(params, row[field])).join(', ')})`
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async find(table, where) {
    const params = this._pool.request()
    const sql = `SELECT TOP 1 * FROM ${table} WHERE (${this._compileWhere(where, params)})`

    const res = await this._query(sql, params)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  async select(table, { where, orders, limit, offset, fields } = {}) {
    const params = this._pool.request()
    let sql = `SELECT ${fields ? fields.join(', ') : `${table}.*`} FROM ${table}`

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
    const params = this._pool.request()
    let sql = `UPDATE ${table} SET ${Object.entries(sets).map(([key, value]) => `${key} = ${this._appendParam(params, value)}`).join(', ')}`

    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async delete(table, where) {
    let sql = `DELETE ${table}`
    const params = this._pool.request()
    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async trans(handler) {
    await this.beginTrans()
    try {
      await handler(this)
      await this.commit()
    } catch (ex) {
      await this.rollback()
    }
  }

  /**
   * 关闭所有连接
   * @memberof Pool
   */
  async close() {
    await this._pool.close()
  }
}

module.exports = {
  Pool
}

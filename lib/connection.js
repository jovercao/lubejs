const oracledb = require('oracledb')
const { Condition } = require('./condition')
const assert = require('assert')
const _ = require('lodash')
const { EventEmitter } = require('events')

const { OperatorMaps, CompareOperators, LogicJoinOperators, LogicNotOperator } = require('./constants')

const rownumField = '"#ROW_NUM#"'
class Connection extends EventEmitter {
  constructor(connection) {
    super()
    this._connection = connection
    this._hasTrans = false
  }

  async beginTrans() {
    if (this._hasTrans === true) {
      throw new Error('事务已经开启!')
    }
    this._hasTrans = true
  }

  async commit() {
    if (!this._hasTrans) {
      throw new Error('未启动事务！')
    }
    await this._connection.commit()
    this._hasTrans = false
  }

  async rollback() {
    if (!this._hasTrans) {
      throw new Error('未启动事务！')
    }
    await this._connection.rollback()
    this._hasTrans = false
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} params 参数列表
   * @param {any} value 参数值
   */
  _appendParam(params, value) {
    return ':P_' + params.push(value)
  }

  /**
   * 编译Where查询条件为Sql
   * @param {*} where where条件
   * @param {array} params 用于接收参数值的数组
   * @returns string sql 返回Sql字符串
   * @memberof Connection
   */
  _compileWhere(where, params) {
    if (where instanceof Condition) {
      where = where.value
    }
    assert(where, 'where条件不能为空')
    assert(_.isObject(where), 'where条件必须为object类型')
    assert(params, '必须传递params用于接受参数')
    assert(_.isArray(params), 'params 必须是数组')

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
    // 如果模板字符串
    if (_.isArray(sql)) {
      sql = sql.reduce((total, current, index) => {
        return total + current + (index > values.length - 1 ? '' : ':p' + index)
      }, '')
      values = Array.prototype.slice.call(arguments, 1)
    }

    const options = {
      // 如果未开启事务，则自动提交
      autoCommit: !this._hasTrans,
      outFormat: oracledb.OUT_FORMAT_OBJECT
    }

    this.emit('execute', { sql, params: values })
    try {
      const res = await this._connection.execute(sql, values || [], options)
      return res
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

    const params = []
    const fields = Object.keys(row)
    const sql = `INSERT INTO ${table}(${fields.join(', ')}) VALUES(${fields.map(field => this._appendParam(params, row[field])).join(', ')})`
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async find(table, where) {
    const params = []
    const sql = `SELECT * FROM ${table} WHERE (${this._compileWhere(where, params)}) AND rownum <= 1`

    const res = await this._query(sql, params)
    if (res.rows && res.rows.length > 0) {
      return res.rows[0]
    }
    return null
  }

  async select(table, { where, orders, limit, offset, fields }) {
    const needCut = offset !== undefined || limit !== undefined
    const params = []
    let sql = `SELECT ${needCut ? `rownum ${rownumField}, ` : ''}${fields ? fields.join(', ') : `${table}.*`} FROM ${table}`

    if (where) {
      sql += ` WHERE ${this._compileWhere(where, params)}`
    }
    if (orders) {
      sql += ` ORDER BY ${Object.entries(orders).map(([field, order]) => `${field} ${order}`).join(', ')}`
    }
    if (needCut) {
      sql = `SELECT * FROM (${sql}) X WHERE `
      if (offset !== undefined) {
        sql += `${rownumField} >= ${offset}`
      }
      if (limit !== undefined) {
        if (offset !== undefined) {
          sql += ' AND '
        }
        sql += `${rownumField} <= ${(offset || 0) + limit}`
      }
    }

    const res = await this._query(sql, params)
    return res.rows
  }

  async update(table, sets, where) {
    const params = []
    let sql = `UPDATE ${table} SET ${Object.entries(sets).map(([key, value]) => `${key} = ${this._appendParam(params, value)}`).join(', ')}`

    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async delete(table, where) {
    let sql = `DELETE ${table}`
    const params = []
    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async close(drainTime) {
    if (this._hasTrans) {
      throw new Error('事务尚未提交！')
    }
    await this._connection.close(drainTime)
  }
}

module.exports = {
  Connection
}

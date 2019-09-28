const oracledb = require('oracledb')
const assert = require('assert')
const _ = require('lodash')

const operators = {
  $and: 'AND',
  $or: 'OR',
  $is: 'IS',
  $in: 'IN',
  $notin: 'NOT IN',
  $eq: '=',
  $gt: '>',
  $gte: '>=',
  $lt: '<',
  $lte: '<=',
  $like: 'LIKE'
}

const logicOperators = ['$and', '$or']
const notOperator = '$not'
const compareOperators = ['$gt', '$lt', '$gte', '$lte', '$in', '$notin', '$like', '$is']

const NULL = Symbol('oracledb#NULL')

const rownumField = '"#ROW_NUM#"'
class Connection {
  constructor(connection) {
    this._connection = connection
    this._hasTrans = false
  }

  beginTrans() {
    if (this._hasTrans === true) {
      throw new Error('事务已经开启')
    }
    this._hasTrans = true
  }

  commit() {
    if (!this._hasTrans) {
      throw new Error('未启动事务！')
    }
    this._connection.commit()
    this._hasTrans = false
  }

  rollback() {
    if (!this._hasTrans) {
      throw new Error('未启动事务！')
    }
    this._connection.rollback()
    this._hasTrans = false
  }

  _paramName(params) {
    return ':P_' + params.length
  }

  /**
   * 编译Where查询条件为Sql
   * @param {*} where where条件
   * @param {array} params 用于接收参数值的数组
   * @returns string sql 返回Sql字符串
   * @memberof Connection
   */
  _compileWhere(where, params) {
    assert(where, 'where条件不能为空')
    assert(_.isObject(where), 'where条件必须为object类型')
    assert(params, '必须传递params用于接受参数')
    assert(_.isArray(params), 'params 必须是数组')

    return Object.entries(where).map(([key, item]) => {
      // 逻辑运算
      if (logicOperators.includes(key)) {
        const operator = operators[key]
        assert(_.isArray(item), '逻辑运算符$or的内容仅允许数组')
        assert(item.length >= 2, 'and 或者 or条件运算至少需要2个条件')
        return '(' + item.map(p => this._compileWhere(p, params)).join(' ' + operator + ' ') + ')'
      }
      if (key === notOperator) {
        const operator = operators[key]
        return `${operator} (${this._compileWhere(item, params)})`
      }

      // 比较运算，默认为： =
      let operator
      let value
      // 如果有指定运算
      if (_.isObject(item)) {
        const keys = Object.keys(item)
        assert(keys.length === 1, `where条件${key}格式不正确，允许比较运算或者$not运算`)
        assert(compareOperators.includes(keys[0]), `比较表达式运算符必须是${compareOperators.join(',')}中的一种`)
        operator = operators[keys[0]]
        value = item[keys[0]]
      } else {
        operator = operators.$eq
        value = item
      }
      // 如果值是NULL
      if (value === NULL) {
        return `${key} ${operator} NULL`
      } else {
        params.push(value)
        const paramName = this._paramName(params)
        return `${key} ${operator} ${paramName}`
      }
    }).join(' ' + operators.$and + ' ')
  }

  async _query(sql, values) {
    // 如果模板字符串
    if (sql instanceof Array) {
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

    const res = await this._connection.execute(sql, values, options)
    return res
  }

  async query(sql, params) {
    const res = await this._query.apply(arguments)
    return res.rows
  }

  async insert(table, row) {
    assert(_.isString(table), 'table 参数必须为字符串')
    assert(!row, 'row 不能为空')
    assert(_.isObject(row), 'row必须为Object')

    const fields = Object.keys(row)
    const sql = `INSERT INTO ${table}(${fields.join(', ')}) VALUES(${fields.map(field => ':' + field).join(', ')})`
    const res = await this._query(sql, row)
    return res.rowsAffected
  }

  async find(table, where) {
    const params = []
    const sql = `SELECT * FROM ${table} WHERE (${this._compileWhere(where, params)}) AND rownum < = 1`

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
        sql += `${rownumField} < ${(offset || 0) + limit}`
      }
    }

    const res = await this._query(sql, params)
    return res.rows
  }

  async update(table, row, where) {
    const params = []
    let sql = `UPDATE ${table} SET ${Object.entries(row).map(([key, value]) => {
      params.push(value)
      const paramName = this._paramName(params)
      return `${key} = ${paramName}`
    }).join(', ')}`

    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res
  }

  async delete(table, where) {
    let sql = `DELETE ${table}`
    const params = []
    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    const res = await this._query(sql, params)
    return res
  }

  async close() {
    this._connection.close()
  }
}

module.exports = {
  Connection,
  NULL
}

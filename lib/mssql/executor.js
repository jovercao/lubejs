const { EventEmitter } = require('events')
const { astType, astEntry, Statement, AST } = require('../builder')
const assert = require('assert')
const _ = require('lodash')
const { OperatorMaps, OrderDirection, CompareOperators, LogicJoinOperators, LogicNotOperator } = require('../constants')

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

  _compileConstant(value, params) {
    if (value === null || value === undefined) {
      return 'NULL'
    }
    if (_.isString(value)) {
      return `'${value.replace(/'/g, "''")}'`
    }
    if (_.isNumber(value)) {
      return value.toString(10)
    }
    if (_.isBoolean(value)) {
      return value ? '1' : '0'
    }
    // if (_.isDate(value)) {
    //   return "'" + moment(value).format('YYYY-MM-DD HH:mm:ss.SSS') + "'"
    // }
    return this._appendParam(params, value)
  }

  _compileExpression(ast, params, defaultType = '$const') {
    return this._compile(ast, params, defaultType, [
      '$field',
      '$add',
      '$sub',
      '$mul',
      '$div',
      '$mod',
      '$quoted',
      '$select',
      '$callfn',
      '$const'
    ],
    'involid expression, ast type: {type}')
  }

  /**
   * 函数调用
   * @param {*} callfn
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  _compileCallFn(callfn, params) {
    return `${callfn.name}(${(callfn.params || []).map(v => this._compileExpression(v, params)).join(', ')})`
  }

  _compileJoins(ast, params) {
    let sql = ''
    for (const { table, on, left } of ast) {
      if (left) {
        sql += ' LEFT'
      }
      sql += ` JOIN ${this._compileSets(table)} ON ${this._compileCondition(on, params)}`
    }
    return sql
  }

  _compileOrderby(orders, params) {
    // 对象格式
    if (_.isPlainObject(orders)) {
      return Object.entries(orders).map(([field, direction]) => `${this._quoted(field)} ${OrderDirection[direction]}`).join(', ')
    }
    // 数组格式
    return orders.map(([exp, direction]) => `${this._compileExpression(exp, params)} ${OrderDirection[direction]}`).join(', ')
  }

  /**
   * 编译 object 格式的默认and条件
   * @param {*} obj
   * @param {*} prams
   */
  _compileDefaultAndCondition(obj, prams) {
    return Object.entries(obj).map(([key, value]) => {
      if (key.startsWith('$')) {
        return this._compileCondition({
          [key]: value
        })
      }
      const [op, v] = astEntry(value, '$eq')
      return `${this._compileField(key)} ${OperatorMaps[op]} ${this._compileExpression(v, prams, '$const')}`
    }).join(' ' + OperatorMaps['$and'] + ' ')
  }

  _compile(ast, params, defaultType, excepts, errMsg) {
    const [type, value] = astEntry(ast, defaultType)
    if (excepts) {
      assert(excepts.includes(type), errMsg ? errMsg.replace('{type}', type) : `syntax error: except ${excepts.join(',')}, but ${type} this`)
    }
    switch (type) {
      // case '$named':
      //   return this._compileNamed(value, params)
      case '$field':
        return this._compileField(value)
      // 加减乘除
      case '$add':
      case '$sub':
      case '$mul':
      case '$div':
      case '$mod':
        return value.map(m => this._compileExpression(m)).join(' ' + OperatorMaps[type] + ' ')
      case '$quoted':
        return '(' + this._compileExpression(value, params) + ')'
      case '$select':
        return this._compileSelectStatement(value, params)
      case '$table':
      case '$view':
      case '$type':
      case '$fn':
        return this._compileObject(value)
      case '$callfn':
        return this._compileCallFn(value, params)
      case '$const':
        return this._compileConstant(value, params)
      case '$insert':
        return this._compileInsertStatement(value, params)
      case '$delete':
        return this._compileDeleteStatement(value, params)
      case '$update':
        return this._compileUpdateStatement(value, params)
      case '$and':
      case '$or':
        if (_.isPlainObject(value)) {
          return this._compileDefaultAndCondition(value, params)
        }
        return '(' + value.map(p => this._compileCondition(p, params)).join(' ' + OperatorMaps[type] + ' ') + ')'
      // 二元比较运算符
      case '$eq':
      case '$neq':
      case '$gt':
      case '$lt':
      case '$gte':
      case '$lte':
      case '$not':
      case '$like':
      case '$is':
      case '$isnot':
        assert(value.length === 2, `${type} operator need 2 params`)
        return `${this._compileExpression(value[0], params, '$field')} ${OperatorMaps[type]} ${this._compileExpression(value[1], params, '$const')}`

      case '$in':
      case '$notin':
        return `${this._compileExpression(value[0], params, '$field')} ${OperatorMaps[type]} (${value[1].map(p => this._compileExpression(p, params, '$const')).join(', ')})`
      case '$assign':
        return this._compileAssignment(value, params)
      default:
        throw new Error('unknow ast type')
    }
  }

  /**
   * 编译命名对象
   * @param {*} ast
   * @param {string} [except='sets'] 预期对象类型， 'sets', 'expression', 'field'
   * @returns
   * @memberof Executor
   */
  _compileNamed(ast, params, except = 'sets') {
    const [exp, name] = ast
    return `${this._compile(exp, params)} AS ${this._quoted(name)}`
  }

  _compileAlias(obj, params, defaultType, excepts) {
    const [type, value] = astEntry(obj)
    if (type === '$named') {
      return value[1]
    }
    return this._compile(obj, params, defaultType, excepts)
  }

  _compileField(field) {
    // 默认quoted
    if (_.isString(field)) {
      return this._quoted(field)
    }

    assert(_.isPlainObject(field), 'ast 格式不正确')
    let sql = this._quoted(field.name)

    if (field.table) {
      const [type, ast] = astEntry(field.table, '$table')
      if (type === '$named') {
        sql = this._quoted(ast[1]) + '.' + sql
      } else {
        sql = this._compileSets(field.table) + '.' + sql
      }
    }
    return sql
  }

  _compileSets(ast, params) {
    // 如果是字符串，默认为表名称
    if (_.isString(ast)) {
      return this._quoted(ast)
    }
    const [type, value] = astEntry(ast, '$table')

    let alias
    if (type === '$named') {
      [ast, alias] = value
    }

    let sql = this._compile(ast, params, '$table', ['$table', '$view', '$callfn'])
    if (alias) {
      sql += ' AS ' + this._quoted(alias)
    }
    return sql
  }

  _compileColumn(ast, params) {
    // 默认为字段
    if (_.isString(ast)) {
      return this._quoted(ast)
    }
    const [type, value] = astEntry(ast, '$field')
    let alias
    if (type === '$named') {
      [ast, alias] = value
    }

    let sql = this._compileExpression(ast, params, '$field')
    if (alias) {
      sql += ' AS ' + this._quoted(alias)
    }
    return sql
  }

  /**
   * 编译Where查询条件为Sql
   * @param {*} condition where条件
   * @param {array} params 用于接收参数值的数组
   * @returns string sql 返回Sql字符串
   * @memberof Pool
   */
  _compileCondition(condition, params) {
    return this._compile(condition, params, '$and', ['$and', '$or', '$eq', '$neq', '$gt', '$lt', '$gte', '$lte', '$not', '$like', '$is', '$in', '$notin', '$isnot'])
  }

  _compileStatement(ast, params) {
    return this._compile(ast, params, ['$insert', '$delete', '$update', '$select'], 'syntax error {type} is not statment')
  }

  _compileObject(obj) {
    if (_.isString(obj)) {
      return this._quoted(obj)
    }

    if (_.isArray(obj)) {
      assert(obj.length >= 1 && obj.length <= 3, 'object name length involid')
    }

    if (_.isPlainObject(obj)) {
      let sql = ''
      const { schema, name, database } = obj
      if (database) {
        sql += this._quoted(database) + '.'
        if (!schema) sql += '.'
      }
      if (schema) {
        sql += this._quoted(schema) = '.'
      }
      if (!name) {
        throw new Error('object name is required')
      }
      sql += this._quoted(name)
      return sql
    }
    throw new Error('error object name ast')
  }

  _compileSelectStatement(select, params) {
    const { table, joins, columns, where, orders, groups } = select
    let sql = `SELECT ${this._compileColumns(columns, params)} FROM ${this._compileSets(table, params)}`
    if (joins && joins.length > 0) {
      sql += this._compileJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this._compileCondition(where, params)
    }
    if (groups && groups.length) {
      sql += ' GROUP BY ' + groups.map(p => this._compileExpression(p, params, '$field')).join(', ')
    }
    if (orders) {
      if (!_.isArray(orders) || orders.length > 0) {
        sql += ' ORDER BY ' + this._compileOrderby(orders, params)
      }
    }
    return sql
  }

  _compileInsertStatement(insert, params) {
    let { table, values } = insert
    let fields
    if (_.isArray(values)) {
      fields = values.map(([key]) => key)
      values = values.map(([, value]) => value)
    } else if (_.isPlainObject(values)) {
      fields = Object.keys(values)
      values = Object.values(values)
    } else {
      throw new Error('involid values ast')
    }
    return `INSERT INTO ${this._compile(table, params, '$table', ['$table'])}(${fields.map(p => this._compileExpression(p, params, '$field'))})
    VALUES(${values.map(p => this._compileExpression(p, params, '$const')).join(', ')})`
  }

  _compileAssignment(assign, params) {
    const { left, right } = assign
    return `${this._compile(left, params, '$field', ['$field'])} = ${this._compileExpression(right, params, '$const')}`
  }

  _compileUpdateStatement(update, params) {
    const { table, from, sets, where, joins } = update
    assert(table, 'table is required by update statement')
    assert(sets, 'set statement un declared')

    // 如果表有别名
    let sql = `UPDATE ${this._compileAlias(table, params, '$table', ['$table'])} SET ${sets.map((ast) => this._compile(ast, params, '$assign', ['$assign'])).join(', ')}`

    if (from) {
      sql += ' FROM ' + this._compileSets(table)
    }
    if (joins) {
      sql += this._compileJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this._compileCondition(where, params)
    }
    return sql
  }

  _compileDeleteStatement(del, params) {
    const { table, where } = del
    assert(table, 'table is required for delete statement')
    let sql = `DELETE ${this._compile(table, params, '$table', ['$table'])}`
    if (where) {
      sql += ' WHERE ' + this._compileCondition(where)
    }
    return sql
  }

  /**
   * columns 支持两种格式:
   * 1. array,写法如下： [ field1, [ field2, alias ] ]
   * 2. object, 写法如下： { field1: table1.field, field2: table1.field2 }
   * @param {*} columns
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  _compileColumns(columns, params) {
    if (_.isArray(columns)) {
      return columns.map(p => this._compileColumn(p, params)).join(', ')
    }

    return Object.entries(columns).map(([name, exp]) => `${this._compileField(name)} = ${this._compileExpression(exp, params, '$field')}`).join(', ')
  }

  async _query(sql, values) {
    // 如果是模板字符串
    if (_.isArray(sql)) {
      const params = {}
      sql = sql.reduce((total, current, index) => {
        total += current
        if (index < arguments.length - 1) {
          total += this._appendParam(params, arguments[index + 1])
        }
        return total
      }, '')
      values = params
    }

    this.emit('command', { sql, params: values })

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
    if (sql instanceof Statement) {
      const ps = {}
      const ast = sql.ast
      sql = this._compile(ast, ps, null, ['$select', '$update', '$insert', '$delete'], 'not support statment')
      const res = await this._query(sql, ps)
      return res
    }
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
    const sql = `SELECT TOP 1 * FROM ${this._quoted(table)} WHERE (${this._compileCondition(where, params)})`

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
      if (where instanceof AST) {
        where = where.ast
      }
      sql += ` WHERE ${this._compileCondition(where, params)}`
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
      sql += ' WHERE ' + this._compileCondition(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }

  async delete(table, where) {
    let sql = `DELETE ${this._quoted(table)}`
    const params = {}
    if (where) {
      sql += ' WHERE ' + this._compileCondition(where, params)
    }
    const res = await this._query(sql, params)
    return res.rowsAffected
  }
}

module.exports = {
  Executor
}

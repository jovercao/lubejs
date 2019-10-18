const { EventEmitter } = require('events')
const { ast, astEntry } = require('../builder')
const assert = require('assert')
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

  _compileConstant(params, value) {
    if (value === null) {
      return 'NULL'
    }
    return this._appendParam(params, value)
  }

  _compileExpression(ast, params, defaultType) {
    // 默认当作常量
    if (!_.isPlainObject(ast) && !defaultType) {
      return this._compileConstant(ast)
    }
    return this._compile(ast, params, defaultType, [
      '$field',
      '$add',
      '$sub',
      '$mul',
      '$div',
      '$mod',
      '$quoted',
      '$select',
      '$fn',
      '$const'
    ],
    'involid expression, ast type: {type}')
  }

  /**
   * 函数调用
   * @param {*} ast
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  _compileCallFn(ast, params) {
    return `${ast.name}(${ast.params.map(v => this._compileExpression(v, params)).join(', ')})`
  }

  _compileJoins(ast, params) {
    let sql = ''
    for (const { table, on, left } of ast) {
      if (left) {
        sql += ' LEFT'
      }
      sql += ` JOIN ${this._compileSets(table)} ON ${this._compileWhere(on, params)}`
    }
    return sql
  }

  _compileOrderby(ast, params) {
    // 对象格式
    if (_.isPlainObject) {
      return ` ORDER BY ${Object.entries(ast).map(([field, direction]) => `${field} ${direction}`).join(', ')}`
    }
    // 数组格式
    return ` ORDER BY ${ast.map(([exp, direction]) => `${this._compileExpression(exp, params)} ${direction}`)}}`
  }

  _compile(ast, params, excepts, errMsg) {
    const [type, value] = astEntry(ast)
    if (excepts) {
      assert(excepts.includes(type), errMsg ? errMsg.replace('{type}', type) : 'syntax error')
    }
    switch (type) {
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
      case '$fn':
        return this._compileCallFn(value, params)
      case '$const':
        return this._compileConstant(value, params)
      case '$insert':
        return this._compileInsertStatement(value, params)
      case '$delete':
        return this._compileDeleteStatement(value, params)
      case '$update':
        return this._compileUpdateStatement(value, params)
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
    if (_.isString(exp)) {
      return `${this._quoted(exp)} AS ${name}`
    }
    if (except === 'sets') {
      return `${this._compile(exp, params, ['$table', '$view', '$callfn'], 'syntax error: {type} is not result sets')} AS ${this._quoted(name)}`
    }
    if (except === 'expression') {
      return `${this._compileExpression(exp, params)} AS ${this._quoted(name)}`
    }
    if (except  === 'field') {
      return `${this._compileField(exp, params)} AS ${this._quoted(name)}`
    }
  }

  _compileField(ast) {
    // 默认quoted
    if (_.isString(ast)) {
      return this._quoted(ast)
    }

    if (_.isArray(ast)) {
      const [name, table] = ast
      return `${this._quoted(table)}.${this._quoted(name)}`
    }

    assert(_.isPlainObject(ast), 'ast 格式不正确')
    let sql = ast.table ? this._quoted(ast.table) + '.' : ''
    sql += this._quoted(ast.name)
    return sql
  }

  _compileSets(ast) {
    // 如果是字符串，默认为表名称
    if (_.isString(ast)) {
      return this._quoted(ast)
    }
    const [type, value] = astEntry(ast, '$named')

    let alias
    if (type === '$named') {
      ast = value[0]
      alias = value[1]
    }

    switch (type) {
      case '$table':
      case '$view':
        return this._compileIdentifier(ast)
      case '$callfn':
        return this._compileCallFn(value)
      default:
        throw new Error(`invalid identifier ast type for from statemtne '${type}'`)
    }
    return sql
  }

  /**
   * 编译Where查询条件为Sql
   * @param {*} ast where条件
   * @param {array} params 用于接收参数值的数组
   * @returns string sql 返回Sql字符串
   * @memberof Pool
   */
  _compileWhere(ast, params) {
    if (ast.ast) {
      ast = ast.ast
    }
    assert(ast, 'where条件不能为空')
    // assert(_.isObject(where), 'where条件必须为object类型')
    // assert(params, '必须传递params用于接受参数')

    const keys = Object.keys(ast)

    if (keys.length === 0) {
      throw new Error('查询条件不能为空')
    }

    // 默认and连接
    if (keys.length > 1) {
      // 转换为正常表达式
      return this._compileWhere({
        $and: Object.entries(ast).map(([key, value]) => ({ [key]: value }))
      }, params)
    }

    // 针对正常化后表达式的解析
    const key = keys[0]
    const node = ast[key]
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

  _compileStatement(ast, params) {
    return this._compile(ast, params, ['$insert', '$delete', '$update', '$select'], 'syntax error {type} is not statment')
  }

  _compileSelectStatement(ast, params) {
    const { table, joins, columns, where, orders, groups } = ast
    let sql = `SELECT ${this._compileColumns(columns, params)} FROM ${this._compileSets(table, params)}`
    if (joins) {
      sql += this._compileJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this._compileWhere(where, params)
    }
    if (groups) {
      sql += ' GROUP BY ' + this._compileGroupby(groups, params)
    }
    if (orders) {
      sql += ' ORDER BY ' + this._compileOrderby(orders, params)
    }
    return sql
  }

  _compileIdentifier(ast) {
    let name, schema, type
    if (_.isString(ast)) {
      type = '$table'
      name = ast
    } else {
      [type, { name, schema }] = astEntry(ast, 'table')
    }
    assert(['$table', '$view', '$fn', '$proc', '$type'].includes(type), 'not identifier ast')
    let sql = ''
    if (schema) {
      sql += this._quoted(schema) + '.'
    }
    sql += this._quoted(name)
    return sql
  }

  _compileInsertStatement(ast) {
    let { table, values } = ast
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
    return `INSERT INTO ${this._compileIdentifier(table)}(${fields.map(p => this._compileField(p))})
    VALUES(${values.map(p => this._compileExpression(p)).join(', ')})`
  }

  _compileUpdateStatement(ast) {

  }

  _compileDeleteStatement(ast) {

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
      return columns.map(p => {
        // 默认当任作字段名
        if (_.isString(p)) {
          return this._quoted(p)
        }
        const [type, value] = astEntry(p)
        // 具名参数
        if (_.isArray(p) || type === '$named') {
          const [ast, name] = value
          return `${this._compileExpression(ast)} AS ${this._quoted(name)}`
        }
        return this._compileExpression(p)
      }).join(', ')
    }

    return Object.entries(columns).map(([name, exp]) => `${name} = ${this._compileExpression(exp)}`).join(', ')
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

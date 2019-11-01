const assert = require('assert')
const moment = require('moment')
const _ = require('lodash')

const { Statement } = require('./ast')
const { checkType, astEntry } = require('./util')
const {
  ASC,
  DESC,
  OUTPUT,
  $and,
  $or,
  $not,
  $is,
  $in,
  $eq,
  $neq,
  $gt,
  $gte,
  $lt,
  $lte,
  $like,
  $add,
  $sub,
  $mul,
  $div,
  $mod,
  $param,
  $var,
  $fn,
  $proc,
  $table,
  // $sysfn,
  // $exec,
  $datatype,
  $fncall,
  $syscall,
  $select,
  $update,
  $insert,
  $delete,
  $iif,
  $execute,
  $assign,
  $const,
  $field,
  $column,
  $quoted,
  $exists,
  SqlSymbolNames
} = require('./constants')

const OperatorMapps = {
  [$and]: 'AND',
  [$or]: 'OR',
  [$not]: 'NOT',
  [$is]: 'IS',
  [$in]: 'IN',
  [$eq]: '=',
  [$neq]: '<>',
  [$gt]: '>',
  [$gte]: '>=',
  [$lt]: '<',
  [$lte]: '<=',
  [$like]: 'LIKE',
  [$add]: '+',
  [$sub]: '-',
  [$mul]: '*',
  [$div]: '/',
  [$mod]: '%'
}

const OrderDirectionMapps = {
  [ASC]: 'ASC',
  [DESC]: 'DESC'
}

class Compiler {
  constructor(ployfill, { strict = true }) {
    this._strict = strict
    this._ployfill = ployfill
  }

  /**
   * 引括标识符，避免关键字被冲突问题
   * @param {string} identifier 标识符
   */
  _quoted (identifier) {
    if (this._strict) {
      return this._ployfill.quoted(identifier)
    } else {
      return identifier
    }
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} values 参数列表
   * @param {any} value 参数值
   */
  _properParam(params, item) {
    if (!params.find(p => p === item)) {
      assert(!params.find(p => p.name === item.name), `parameter ${item.name} is declared`)
      params.push(item)
    }
    return this._ployfill.properParameter(item.name)
  }

  _parseConstant(value) {
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
    if (_.isDate(value)) {
      return "CONVERT(DATETIME, '" + moment(value).format('YYYY-MM-DD HH:mm:ss.SSS') + "')"
    }
    if (_.isBuffer(value)) {
      return '0x' + value.toString('hex')
    }
    if (_.isArrayBuffer(value) || _.isArray(value)) {
      return '0x' + Buffer.from(value).toString('hex')
    }
    if (_.isTypedArray(value)) {
      return '0x' + Buffer.from(value.buffer).toString('hex')
    }
    console.log('compile constant', value)
    const ex = new Error('unsupport constant type')
    ex.value = value
    throw ex
  }

  _compileExpression(ast, params, defaultType = $const) {
    return this._compile(ast, params, defaultType, [
      $field,
      $add,
      $sub,
      $mul,
      $div,
      $mod,
      $quoted,
      $select,
      $fncall,
      $const,
      $syscall,
      $iif,
      $var,
      $param
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
  _parseCallFn(callfn, params) {
    return `${this._compile(callfn.fn, params, $fn, [$fn])}(${(callfn.params || []).map(v => this._compileExpression(v, params)).join(', ')})`
  }

  _parseJoins(ast, params) {
    let sql = ''
    for (const { table, on, left } of ast) {
      if (left) {
        sql += ' LEFT'
      }
      sql += ` JOIN ${this._compileSets(table)} ON ${this._compileCondition(on, params)}`
    }
    return sql
  }

  _compile(ast, params, defaultType, excepts, errMsg, handler) {
    const [type, item] = astEntry(ast, defaultType)
    if (excepts) {
      checkType(type, excepts, errMsg)
    }
    let sql
    switch (type) {
      case $select:
        sql = this._compileSelectStatement(item, params)
        break
      case $insert:
        sql = this._compileInsertStatement(item, params)
        break
      case $delete:
        sql = this._compileDeleteStatement(item, params)
        break
      case $update:
        sql = this._parseUpdateStatement(item, params)
        break
      case $column:
        sql = this._parseColumn(item, params)
        break
      case $param:
        sql = this._properParam(params, item)
        break
      case $field:
        sql = this._parseField(item)
        break
      case $var:
        sql = item
        break
      case $quoted:
        sql = '(' + this._compileExpression(item, params) + ')'
        break
      case $table:
      // case $view:
        sql = item.alias ? this._compileObject(item) + ' AS ' + this._quoted(item.alias) : this._compileObject(item)
        break
      case $proc:
        sql = this._compileObject(item)
        break
      case $execute:
        // TODO: 兼容性有待改进,目前仅兼容MSSQL
        sql = `EXEC ${
          this._compile(require('./builder').output('_ReturnValue_', require('./constants').NUMBER).ast, params)
        } = ${this._compile(item.proc, params, $proc, [$proc])} ${
          item.params.map(p => this._compile(p, params, $const, [$const, $var, $param], null, (txt, tp, it) => {
            if (tp === $param && it.direction === OUTPUT) {
              return txt + ' OUT'
            }
            return txt
          })
        ).join(', ')}`
        break
      case $fncall:
        sql = item.alias ? this._parseCallFn(item, params) + ' AS ' + this._quoted(item.alias) : this._parseCallFn(item, params)
        break
      case $const:
        sql = this._parseConstant(item, params)
        break
      case $iif:
        sql = `CASE WHEN ${this._compileCondition(item[0])} THEN ${this._compileExpression(item[1])} ELSE ${this._compileExpression(item[2])} END`
        break
      case $and:
      case $or:
        sql = '(' + item.map(p => this._compileCondition(p, params)).join(' ' + OperatorMapps[type] + ' ') + ')'
        break
      // 二元比较运算符
      case $eq:
      case $neq:
      case $gt:
      case $lt:
      case $gte:
      case $lte:
      case $like:
      case $is:
        assert(item.length === 2, `${SqlSymbolNames[type]} operator need 2 params`)
        sql = `${this._compileExpression(item[0], params, $field)} ${OperatorMapps[type]} ${this._compileExpression(item[1], params, $const)}`
        break
      case $not:
        sql = ` NOT (${this._compileCondition(item, params)})`
        break
      case $in:
        sql = `${this._compileExpression(item[0], params, $field)} ${OperatorMapps[type]} (${item[1].map(p => this._compileExpression(p, params, $const)).join(', ')})`
        break
      // 加减乘除
      case $add:
      case $sub:
      case $mul:
      case $div:
        break
      case $mod:
        sql = item.map(m => this._compileExpression(m)).join(' ' + OperatorMapps[type] + ' ')
        break
      case $exists:
        sql = `EXISTS(${this._compile(item, params, $select, [$select])})`
        break
      case $datatype:
        sql = this._ployfill.typeMapps[item]
        break
      case $fn:
        sql = this._compileObject(item)
        break
      case $syscall:
        sql = this._ployfill.sysfnMapps[item.name]
        if (sql) {
          sql = sql.replace(/(\$\d{1,3})/g, (match) => {
            const index = parseInt(match.substr(1))
            sql = this._compileExpression(item.params[index])
          })
        } else {
          sql = `${item.name.toUpperCase()}(${item.params.map(p => this._compileExpression(p))})`
        }
        break
      case $assign:
        sql = this._compileAssignment(item, params)
        break
      default:
        throw new Error('unknow ast type')
    }
    if (handler) {
      return handler(sql, type, item)
    }
    return sql
  }

  _compileSetsAlias(ast, params, defaultType, excepts) {
    if (!excepts) {
      excepts = [$table, $fncall]
    }
    const [type, value] = astEntry(ast, defaultType)
    if (value.alias) {
      if (excepts) {
        checkType(type, excepts)
      }
      return this._quoted(value.alias)
    }
    return this._compile(ast, params, defaultType, excepts)
  }

  _parseField(field) {
    // 默认quoted
    if (_.isString(field)) {
      if (field === '*') {
        return field
      }
      return this._quoted(field)
    }

    if (_.isPlainObject(field)) {
      let sql = field.name === '*' ? '*' : this._quoted(field.name)

      if (field.table) {
        sql = this._compileSetsAlias(field.table) + '.' + sql
      }
      return sql
    }
    throw new Error('Involid field AST.')
  }

  _compileSets(ast, params) {
    // 如果是字符串，默认为表名称
    if (_.isString(ast)) {
      return this._quoted(ast)
    }
    return this._compile(ast, params, $table, [$table, $fncall]) // $view,
  }

  /**
   * 编译Where查询条件为Sql
   * @param {*} condition where条件
   * @param {array} params 用于接收参数值的数组
   * @returns string sql 返回Sql字符串
   * @memberof Pool
   */
  _compileCondition(condition, params) {
    return this._compile(condition, params, $and, [$and, $or, $eq, $neq, $gt, $lt, $gte, $lte, $not, $like, $is, $in, $exists])
  }

  _compileStatement(ast, params) {
    return this._compile(ast, params, [$insert, $delete, $update, $select], 'syntax error {type} is not statment')
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
        sql += this._quoted(schema) + '.'
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
    const { table, top, joins, columns, where, orders, groups, offset, limit, distinct } = select
    let sql = 'SELECT '
    if (distinct) {
      sql += 'DISTINCT '
    }
    if (_.isNumber(top)) {
      sql += `TOP ${top} `
    }
    sql += this._parseColumns(columns, params)
    if (table) {
      sql += ` FROM ${this._compileSets(table, params)}`
    }
    if (joins && joins.length > 0) {
      sql += this._parseJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this._compileCondition(where, params)
    }
    if (groups && groups.length) {
      sql += ' GROUP BY ' + groups.map(p => this._compileExpression(p, params, $field)).join(', ')
    }
    if (orders) {
      if (!_.isArray(orders) || orders.length > 0) {
        sql += ' ORDER BY ' + orders.map(([exp, direct]) => `${this._compileExpression(exp, params, $field)} ${OrderDirectionMapps[direct || ASC]}`).join(', ')
      }
    }

    if (_.isNumber(offset) || _.isNumber(limit)) {
      if (!orders || orders.length === 0) {
        throw new Error('offset needs must use with order by statement')
      }
      sql += ` OFFSET ${offset || 0} ROWS`
      if (_.isNumber(limit)) {
        sql += ` FETCH NEXT ${limit} ROWS ONLY`
      }
    }

    return sql
  }

  _compileInsertStatement(insert, params) {
    const { table, values, fields } = insert
    let sql = `INSERT INTO ${this._compile(table, params, $table, [$table])}`

    if (fields) {
      sql += `(${fields.map(p => this._compileExpression(p, params, $field))})`
    }

    if (_.isArray(values)) {
      sql += ' VALUES'
      sql += values.map(row => '(' + row.map(v => this._compileExpression(v, params, $const)).join(', ') + ')').join(', ')
    } else {
      sql += ' ' + this._compile(values, params, $select, [$select])
    }

    return sql
  }

  _compileAssignment(assign, params) {
    const { left, right } = assign
    return `${this._compile(left, params, $field, [$field])} = ${this._compileExpression(right, params, $const)}`
  }

  _parseUpdateStatement(update, params) {
    const { table, sets, where, joins } = update
    assert(table, 'table is required by update statement')
    assert(sets, 'set statement un declared')

    let sql = `UPDATE ${this._compileSetsAlias(table, params, $table, [$table])} SET ${sets.map(([field, value]) => `${this._compile(field, params, $field, [$field, $var, $param])} = ${this._compileExpression(value)}`).join(', ')}`

    sql += ' FROM ' + this._compileSets(table)

    if (joins) {
      sql += this._parseJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this._compileCondition(where, params)
    }
    return sql
  }

  _compileDeleteStatement(del, params) {
    const { table, joins, where } = del
    assert(table, 'table is required for delete statement')
    let sql = `DELETE ${this._compileSetsAlias(table, params, $table, [$table])}`
    sql += ' FROM ' + this._compileSets(table)

    if (joins) {
      sql += this._parseJoins(joins, params)
    }

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
  _parseColumns(columns, params) {
    return columns.map(p => this._compile(p, params, $column)).join(', ')
  }

  _parseColumn(ast, params) {
    // 默认为字段
    if (_.isString(ast)) {
      return this._quoted(ast)
    }

    if (_.isArray(ast)) {
      const [exp, name] = ast

      let sql = this._compileExpression(exp, params, $field)
      if (name) {
        sql += ' AS ' + this._quoted(name)
      }
      return sql
    }

    if (_.isPlainObject(ast)) {
      return this._compileExpression(ast, params, $field)
    }

    // 常量
    return this._parseConstant(ast)
  }

  compile(statement) {
    const params = []
    assert(statement instanceof Statement, 'involid statement, statement must instance of Statement')
    const sql = this._compile(statement.ast, params)
    return {
      sql,
      params
    }
  }
}

module.exports = {
  Compiler
}

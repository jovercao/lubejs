import * as assert from 'assert'
import * as moment from 'moment'
import * as _ from 'lodash'

import { AST, Parameter, Identifier, Constant, Expression, Bracket, Statement, Alias, Declare, Delete, Insert, Assignment, Update, Select, Invoke, Case, BinaryExpression, UnaryExpression, Variant, Condition, Join, InnerExpression }  from './ast'
import { SqlSymbol } from './constants'
import { stat } from 'fs'
import { identity } from './builder'

export interface Command {
  sql: string
  params: Parameter[]
}

export interface Parser {
  (ast: AST): Command
}

/**
 * 兼容
 */
export interface Ployfill {
  /**
   * 标识符引用，左
   */
  quotedLeft: string
  /**
   * 标识符引用，右
   */
  quotedRight: string

  /**
   * 参数前缀
   */
  parameterPrefix: string

  /**
   * 变量前缀
   */
  variantPrefix: string

  /**
   * 集合别名连接字符，默认为 ''
   */
  setsAliasJoinWith: string

  /**
   * 字段别名连接字符器，默认为 ''
   */
  fieldAliasJoinWith: string
}

/**
 * 编译选项
 */
export interface ParserOptions {
  /**
   * 是否启用严格模式，默认启用
   * 如果为false，则生成的SQL标识不会被[]或""包括
   */
  strict: true
}

/**
 * AST到SQL的编译器
 */
export class Parser {
  private _strict: boolean
  readonly ployfill: Ployfill

  constructor(ployfill: Ployfill, { strict = true }) {
    this._strict = strict
    this.ployfill = ployfill
  }

  /**
   * 解析标识符
   * @param identifier 标识符
   */
  protected parseIdentifier(identifier: Identifier): string {
    const sql = this.quoted(identifier.name)
    if (identifier.parent) {
      return this.parseIdentifier(identifier.parent) + '.' + sql
    }
    return sql
  }

  /**
   * 标识符转换，避免关键字被冲突问题
   * @param {string} identifier 标识符
   */
  private quoted(identifier: string): string {
    if (this._strict) {
      return this.ployfill.quotedLeft + identifier + this.ployfill.quotedRight
    }
    return identifier
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} values 参数列表
   * @param {any} value 参数值
   */
  protected parseParameter(param: Parameter, params: Set<Parameter>): string {
    params.add(param)
    return this.ployfill.parameterPrefix + param.name || ''
  }

  protected parseVariant(variant: Variant, params: Set<Parameter>): string {
    return this.ployfill.variantPrefix + variant.name
  }

  protected parseConstant(constant: Constant) {
    const value = constant.value
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
      return '0x' + (value as Buffer).toString('hex')
    }
    if (_.isArrayBuffer(value) || _.isArray(value)) {
      return '0x' + Buffer.from(value).toString('hex')
    }
    throw new Error('unsupport constant value type:' + value.toString())
  }

  protected parse(ast: AST, params: Set<Parameter>) {
    if (ast instanceof Expression) {
      return this.parseExpression(ast as Expression, params)
    }
    if (ast instanceof Statement) {
      return this.parseStatment(ast, params)
    }
    if (ast instanceof Condition) {
      return this.parseCondition(ast as Condition, params)
    }
    if (ast instanceof Bracket) {
      return '(' + this.parse(ast.context, params) + ')'
    }

    throw new Error('Unsupport AST type: ' + ast.type)
  }

  protected parseStatment(statement: Statement, params: Set<Parameter>): string {
    switch (statement.type) {
      case SqlSymbol.SELECT:
        return this.parseSelectStatement(statement as Select, params)
      case SqlSymbol.UPDATE:
        return this.parseUpdateStatement(statement as Update, params)
      case SqlSymbol.AGGREGATE:
        return this.parseAssignment(statement as Assignment, params)
      case SqlSymbol.INSERT:
        return this.parseInsertStatement(statement as Insert, params)
      case SqlSymbol.DELETE:
        return this.parseDeleteStatement(statement as Delete, params)
      case SqlSymbol.DECLARE:
        return this.parseDeclareStatement(statement as Declare, params)
      default:
        throw new Error('Unsupport statement type: ' + statement.type)
    }
  }

  protected parseAlias(alias: Alias, params: Set<Parameter>): string {
    return this.parseExpression(alias.expr, params) + this.ployfill.setsAliasJoinWith + alias.name
  }

  protected parseCase(caseExpr: Case, params: Set<Parameter>): string {

  }

  protected parseBinaryExpression(expr: BinaryExpression, params: Set<Parameter>): string {

  }

  protected parseUnaryExpression(expr: UnaryExpression, params: Set<Parameter>): string {

  }

  protected parseExpression(expr: Expression, params: Set<Parameter>): string {
    switch (expr.type) {
      case SqlSymbol.BRACKET:
        return '(' + this.parse((expr as InnerExpression).value, params) + ')'
      case SqlSymbol.CONSTANT:
        return this.parseConstant(expr as Constant)
      case SqlSymbol.ALIAS:
        return this.parseAlias(expr as Alias, params)
      case SqlSymbol.IDENTITY:
        return this.parseIdentifier(expr as Identifier)
      case SqlSymbol.INVOKE:
        return this.parseInvoke(expr as Invoke, params)
      case SqlSymbol.CASE:
        return this.parseCase(expr as Case, params)
      case SqlSymbol.BINARY:
        return this.parseBinaryExpression(expr as BinaryExpression, params)
      case SqlSymbol.UNARY:
        return this.parseUnaryExpression(expr as UnaryExpression, params)
      case SqlSymbol.PARAMETER:
        return this.parseParameter(expr as Parameter, params)
      case SqlSymbol.VARAINT:
        return this.parseVariant(expr as Variant, params)
      default:
        throw new Error('Unsupport expression type: ' + expr.type)
    }
  }

  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected parseInvoke(invoke: Invoke, params) {
    return `${this.parseIdentifier(invoke.func)}(${(invoke.params || []).map(v => this.parseExpression(v, params)).join(', ')})`
  }

  protected parseJoins(join: Join, params) {
    let sql = ''
    for (const { table, on, left } of join) {
      if (left) {
        sql += ' LEFT'
      }
      sql += ` JOIN ${this._compileSets(table)} ON ${this.parseCondition(on, params)}`
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
  protected parseCondition(condition, params) {

  }

  protected parseSelectStatement(select, params) {
    const { table, top, joins, columns, where, orders, groups, having, offset, limit, distinct } = select
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
      sql += this.parseJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this.parseCondition(where, params)
    }
    if (groups && groups.length) {
      sql += ' GROUP BY ' + groups.map(p => this.parseExpression(p, params, $field)).join(', ')
    }
    if (having) {
      sql += ' HAVING ' + this.parseCondition(having, params)
    }
    if (orders) {
      if (!_.isArray(orders) || orders.length > 0) {
        sql += ' ORDER BY ' + orders.map(([exp, direct]) => `${this.parseExpression(exp, params, $field)} ${OrderDirectionMapps[direct || ASC]}`).join(', ')
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

  parseInsertStatement(insert, params) {
    const { table, values, fields } = insert
    let sql = `INSERT INTO ${this._compile(table, params, $table, [$table])}`

    if (fields) {
      sql += `(${fields.map(p => this.parseExpression(p, params, $field))})`
    }

    if (_.isArray(values)) {
      sql += ' VALUES'
      sql += values.map(row => '(' + row.map(v => this.parseExpression(v, params, $const)).join(', ') + ')').join(', ')
    } else {
      sql += ' ' + this._compile(values, params, $select, [$select])
    }

    return sql
  }

  parseAssignment(assign, params) {
    const { left, right } = assign
    return `${this._compile(left, params, $field, [$field])} = ${this.parseExpression(right, params, $const)}`
  }

  parseDeclareStatement(declare: Declare, params: Set<Parameter>): string {

  }

  parseUpdateStatement(update, params) {
    const { table, sets, where, joins } = update
    assert(table, 'table is required by update statement')
    assert(sets, 'set statement un declared')

    let sql = `UPDATE ${this._compileSetsAlias(table, params, $table, [$table])} SET ${sets.map(([field, value]) => `${this._compile(field, params, $field, [$field, $var, $param])} = ${this.parseExpression(value)}`).join(', ')}`

    sql += ' FROM ' + this._compileSets(table)

    if (joins) {
      sql += this.parseJoins(joins, params)
    }
    if (where) {
      sql += ' WHERE ' + this.parseCondition(where, params)
    }
    return sql
  }

  parseDeleteStatement(del, params) {
    const { table, joins, where } = del
    assert(table, 'table is required for delete statement')
    let sql = `DELETE ${this._compileSetsAlias(table, params, $table, [$table])}`
    sql += ' FROM ' + this._compileSets(table)

    if (joins) {
      sql += this.parseJoins(joins, params)
    }

    if (where) {
      sql += ' WHERE ' + this.parseCondition(where)
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
      return this.quoted(ast)
    }

    if (_.isArray(ast)) {
      const [exp, name] = ast

      let sql = this.parseExpression(exp, params, $field)
      if (name) {
        sql += ' AS ' + this.quoted(name)
      }
      return sql
    }

    if (_.isPlainObject(ast)) {
      return this.parseExpression(ast, params, $field)
    }

    // 常量
    return this.parseConstant(ast)
  }
}

module.exports = {
  Parser: Compiler
}

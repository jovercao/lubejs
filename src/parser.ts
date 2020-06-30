import * as assert from 'assert'
import * as moment from 'moment'
import * as _ from 'lodash'

import {
  AST, Parameter, Identifier, Constant, When,
  Bracket, Alias, Declare, Delete, Insert,
  Assignment, Update, Select, Invoke, Case,
  Variant, Join, IUnary,
  IBinary, Union, AnyIdentifier
} from './ast'
import { SqlSymbol } from './constants'

export interface Command {
  sql: string
  params: Parameter[]
}

/**
 * 命令生成器
 */
interface CommandBuilder {
  sql: string[],
  params: Set<Parameter>
}

// TODO: 使用命令生成器优化SQL字符串拼接

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
    return this.properParameterName(param.name)
  }

  properParameterName(name?: string) {
    return this.ployfill.parameterPrefix + (name || '')
  }

  protected properVariantName(name: string) {
    return this.ployfill.variantPrefix + name
  }

  protected parseVariant(variant: Variant, params: Set<Parameter>): string {
    return this.properVariantName(variant.name)
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
    console.debug(value)
    throw new Error('unsupport constant value type:' + value.toString())
  }

  public parse(ast: AST): Command {
    const params = new Set<Parameter>()
    return {
      sql: this.parseAST(ast, params),
      params: Array.from(params)
    }
  }

  protected parseAST(ast: AST, params: Set<Parameter>): string {
    switch (ast.type) {
      case SqlSymbol.SELECT:
        return this.parseSelect(ast as Select, params)
      case SqlSymbol.UPDATE:
        return this.parseUpdate(ast as Update, params)
      case SqlSymbol.ASSIGNMENT:
        return this.parseAssignment(ast as Assignment, params)
      case SqlSymbol.INSERT:
        return this.parseInsert(ast as Insert, params)
      case SqlSymbol.DELETE:
        return this.parseDelete(ast as Delete, params)
      case SqlSymbol.DECLARE:
        return this.parseDeclare(ast as Declare, params)
      case SqlSymbol.BRACKET:
        return this.parseBracket(ast as Bracket<any>, params)
      case SqlSymbol.CONSTANT:
        return this.parseConstant(ast as Constant)
      case SqlSymbol.ALIAS:
        return this.parseAlias(ast as Alias, params)
      case SqlSymbol.IDENTIFIER:
        return this.parseIdentifier(ast as Identifier)
      case SqlSymbol.ANY:
        return (ast as AnyIdentifier).name
      case SqlSymbol.INVOKE:
        return this.parseInvoke(ast as Invoke, params)
      case SqlSymbol.CASE:
        return this.parseCase(ast as Case, params)
      case SqlSymbol.BINARY:
        return this.parseBinary(ast as unknown as IBinary, params)
      case SqlSymbol.UNARY:
        return this.parseUnary(ast as unknown as IUnary, params)
      case SqlSymbol.PARAMETER:
        return this.parseParameter(ast as Parameter, params)
      case SqlSymbol.VARAINT:
        return this.parseVariant(ast as Variant, params)
      case SqlSymbol.JOIN:
        return this.parseJoin(ast as Join, params)
      case SqlSymbol.UNION:
        return this.parseUnion(ast as Union, params)
      default:
        throw new Error('Error AST type: ' + ast.type)
    }
  }

  protected parseBracket<T>(bracket: Bracket<T>, params: Set<Parameter>): string {
    let inner
    if (_.isArray(bracket.context)) {
      inner = bracket.context.map(ast => this.parseAST((ast as Bracket<AST>).context, params)).join(', ')
    }  else {
      inner = this.parseAST(bracket.context as unknown as AST, params)
    }
    return '(' + inner + ')'
  }

  protected parseUnion(union: Union, params: Set<Parameter>): string {
    return 'UNION ' + union.all ? 'ALL ' : '' + this.parseAST(union.select, params)
  }

  protected parseAlias(alias: Alias, params: Set<Parameter>): string {
    return this.parseAST(alias.expr, params) + ' ' + this.ployfill.setsAliasJoinWith + ' ' + alias.name
  }

  protected parseCase(caseExpr: Case, params: Set<Parameter>): string {
    return 'CASE ' + this.parseAST(caseExpr.expr, params) +
      caseExpr.whens.map(when => this.parseWhen(when, params)) +
      (caseExpr.defaults || '') && ' ELSE ' + this.parseAST(caseExpr.defaults, params)
  }

  protected parseWhen(when: When, params: Set<Parameter>): string {
    return 'WHEN ' + this.parseAST(when.expr, params) + ' THEN ' + this.parseAST(when.value, params)
  }

  protected parseBinary(expr: IBinary, params: Set<Parameter>): string {
    return this.parseAST(expr.left, params) + ' ' + expr.operator + ' ' + this.parseAST(expr.right, params)
  }

  protected parseUnary(expr: IUnary, params: Set<Parameter>): string {
    return expr.operator + ' ' + this.parseAST(expr.next, params)
  }

  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected parseInvoke(invoke: Invoke, params: Set<Parameter>): string {
    return `${this.parseIdentifier(invoke.func)}(${(invoke.params || []).map(v => this.parseAST(v, params)).join(', ')})`
  }

  protected parseJoin(join: Join, params: Set<Parameter>): string {
    return (join.left ? 'LEFT ' : '') + 'JOIN ' + this.parseAST(join.table, params) + ' ON ' + this.parseAST(join.on, params)
  }

  protected parseSelect(select: Select, params): string {
    const { tables, top, joins, unions, columns, filters, sorts, groups, havings, offsets, limits, isDistinct } = select
    let sql = 'SELECT '
    if (isDistinct) {
      sql += 'DISTINCT '
    }
    if (_.isNumber(top)) {
      sql += `TOP ${top} `
    }
    sql += columns.map(expr => this.parseAST(expr, params)).join(', ')
    if (tables) {
      sql += ' FROM ' + tables.map(table => this.parseAST(table, params)).join(', ')
    }
    if (joins && joins.length > 0) {
      sql += ' ' + joins.map(join => this.parseJoin(join, params)).join(' ')
    }
    if (filters) {
      sql += ' WHERE ' + this.parseAST(filters, params)
    }
    if (groups && groups.length) {
      sql += ' GROUP BY ' + groups.map(p => this.parseAST(p, params)).join(', ')
    }
    if (havings) {
      sql += ' HAVING ' + this.parseAST(havings, params)
    }
    if (sorts && sorts.length > 0) {
      sql += ' ORDER BY ' + sorts.map(sort => `${this.parseAST(sort.expr, params)} ${sort.direction}`).join(', ')
    }

    if (_.isNumber(offsets)) {
      sql += ` OFFSET ${offsets || 0} ROWS`
    }
    if (_.isNumber(limits)) {
      sql += ` FETCH NEXT ${limits} ROWS ONLY`
    }

    if (unions) {
      sql += ' ' + this.parseUnion(unions, params)
    }

    return sql
  }

  parseInsert(insert: Insert, params: Set<Parameter>): string {
    const { table, rows, fields } = insert
    let sql = 'INSERT INTO '

    sql += this.parseAST(table, params)

    if (fields) {
      sql += '(' + fields.map(field => this.parseAST(field, params)).join(', ') + ')'
    }

    if (_.isArray(rows)) {
      sql += ' VALUES'
      sql += rows.map(row => '(' + row.map(v => this.parseAST(v, params)).join(', ') + ')').join(', ')
    } else {
      sql += ' ' + this.parseAST(rows, params)
    }

    return sql
  }

  parseAssignment(assign: Assignment, params: Set<Parameter>): string {
    const { left, right } = assign
    return this.parseAST(left, params) + ' = ' + this.parseAST(right, params)
  }

  parseDeclare(declare: Declare, params: Set<Parameter>): string {
    return 'DECLARE ' + declare.declares.map(varDec => this.properVariantName(varDec.name) + ' ' + varDec.dataType).join(', ')
  }

  parseUpdate(update: Update, params: Set<Parameter>): string {
    const { table, sets, filters, tables, joins } = update
    assert(table, 'table is required by update statement')
    assert(sets, 'set statement un declared')

    let sql = 'UPDATE '
    // 必须以Identifier解析，否则会生成别名
    sql += this.parseIdentifier(table)

    sql += ' SET ' + sets.map(({ left, right }) => this.parseAST(left, params) + ' = ' + this.parseAST(right, params)).join(', ')

    if (tables && tables.length > 0) {
      sql += ' FROM ' + tables.map(table => this.parseAST(table, params)).join(', ')
    }

    if (joins && joins.length > 0) {
      sql += ' ' + joins.map(join => this.parseJoin(join, params)).join(' ')
    }
    if (filters) {
      sql += ' WHERE ' + this.parseAST(filters, params)
    }
    return sql
  }

  parseDelete(del: Delete, params: Set<Parameter>): string {
    const { table, tables, joins, filters } = del
    let sql = 'DELETE '
    if (table) sql += this.parseAST(table, params)
    if (tables && tables.length > 0) {
      sql += ' FROM ' + tables.map(table => this.parseAST(table, params)).join(', ')
    }

    if (joins) {
      sql += joins.map(join => this.parseJoin(join, params)).join(' ')
    }
    if (filters) {
      sql += ' WHERE ' + this.parseAST(filters, params)
    }
    return sql
  }
}

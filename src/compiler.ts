import * as assert from 'assert'
import * as moment from 'moment'
import * as _ from 'lodash'

import {
  AST, Parameter, Identifier, Constant, When,
  Bracket, Alias, Declare, Delete, Insert,
  Assignment, Update, Select, Invoke, Case,
  Variant, Join, IUnary, Execute,
  Union, List, SortInfo, UnaryLogic as UnaryLogic, UnaryCompare as UnaryCompare, UnaryCalculate, BinaryLogic as BinaryLogic, BinaryCompare, BinaryCalculate, ExistsCompare
} from './ast'
import { SQL_SYMBOLE, PARAMETER_DIRECTION } from './constants'

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
 * 编译选项
 */
export interface CompileOptions {
  /**
   * 是否启用严格模式，默认启用
   * 如果为false，则生成的SQL标识不会被[]或""包括
   */
  strict?: boolean,
  /**
   * 标识符引用，左
   */
  quotedLeft?: string
  /**
   * 标识符引用，右
   */
  quotedRight?: string

  /**
   * 参数前缀
   */
  parameterPrefix?: string

  /**
   * 变量前缀
   */
  variantPrefix?: string
}

export const RETURN_VALUE_PARAMETER_NAME: string = '__RETURN_VALUE__'

const DEFAULT_COMPILE_OPTIONS: CompileOptions = {

  strict: true,

  /**
   * 标识符引用，左
   */
  quotedLeft: '"',
  /**
   * 标识符引用，右
   */
  quotedRight: '"',

  /**
   * 参数前缀
   */
  parameterPrefix: '@',

  /**
   * 变量前缀
   */
  variantPrefix: '@'
}

/**
 * AST到SQL的编译器
 */
export class Compiler {
  options: CompileOptions

  constructor(options?: CompileOptions) {
    this.options = Object.assign({}, DEFAULT_COMPILE_OPTIONS, options)
  }

  /**
   * 解析标识符
   * @param identifier 标识符
   */
  protected compileIdentifier(identifier: Identifier<any>, params?: Set<Parameter>, parent?: AST): string {
    const sql = identifier.type === SQL_SYMBOLE.BUILDIN_IDENTIFIER ? identifier.name : this.quoted(identifier.name)
    const parentNode = Reflect.get(identifier, 'parent')
    if (parentNode) {
      return this.compileIdentifier(parentNode, params, identifier) + '.' + sql
    }
    return sql
  }

  /**
   * 标识符转换，避免关键字被冲突问题
   * @param {string} identifier 标识符
   */
  private quoted(identifier: string): string {
    if (this.options.strict) {
      return this.options.quotedLeft + identifier + this.options.quotedRight
    }
    return identifier
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} values 参数列表
   * @param {any} value 参数值
   */
  protected compileParameter(param: Parameter, params: Set<Parameter>, parent: AST = null): string {
    params.add(param)
    return this.prepareParameterName(param)
  }

  public prepareParameterName(p: Parameter) {
    return this.options.parameterPrefix + (p.name || '')
  }

  protected properVariantName(name: string) {
    return this.options.variantPrefix + name
  }

  protected compileVariant(variant: Variant, params: Set<Parameter>, parent?: AST): string {
    return this.properVariantName(variant.name)
  }

  protected compileDate(date: Date) {
    return "'" + moment(date).format('YYYY-MM-DD HH:mm:ss.SSS') + "'"
  }

  protected compileBoolean(value: boolean) {
    return value ? '1' : '0'
  }

  protected compileString(value: string) {
    return `'${value.replace(/'/g, "''")}'`
  }

  protected compileConstant(constant: Constant, params?: Set<Parameter>, parent?: AST) {
    const value = constant.value
    // 为方便JS，允许undefined进入，留给TS语法检查
    if (value === null || value === undefined) {
      return 'NULL'
    }

    if (_.isString(value)) {
      return this.compileString(value)
    }

    if (_.isNumber(value) || typeof value === 'bigint') {
      return value.toString(10)
    }

    if (_.isBoolean(value)) {
      return this.compileBoolean(value)
    }
    if (_.isDate(value)) {
      return this.compileDate(value)
    }
    if (_.isBuffer(value)) {
      return '0x' + (value as Buffer).toString('hex')
    }
    if (_.isArrayBuffer(value) || _.isArray(value)) {
      return '0x' + Buffer.from(value).toString('hex')
    }
    console.debug(value)
    // @ts-ignore
    throw new Error('unsupport constant value type:' + typeof value)
  }

  public compile(ast: AST): Command {
    const params = new Set<Parameter>()
    return {
      sql: this.compileAST(ast, params),
      params: Array.from(params)
    }
  }

  protected compileAST(ast: AST, params: Set<Parameter>, parent?: AST): string {
    switch (ast.type) {
      case SQL_SYMBOLE.SELECT:
        return this.compileSelect(ast as Select, params, parent)
      case SQL_SYMBOLE.UPDATE:
        return this.compileUpdate(ast as Update, params, parent)
      case SQL_SYMBOLE.ASSIGNMENT:
        return this.compileAssignment(ast as Assignment, params, parent)
      case SQL_SYMBOLE.INSERT:
        return this.compileInsert(ast as Insert, params, parent)
      case SQL_SYMBOLE.DELETE:
        return this.compileDelete(ast as Delete, params, parent)
      case SQL_SYMBOLE.DECLARE:
        return this.compileDeclare(ast as Declare, params, parent)
      case SQL_SYMBOLE.BRACKET_EXPRESSION:
        return this.compileBracket(ast as Bracket<any>, params, parent)
      case SQL_SYMBOLE.CONSTANT:
        return this.compileConstant(ast as Constant, params, parent)
      case SQL_SYMBOLE.INVOKE_ARGUMENT_LIST:
        return this.compileInvokeArgumentList(ast as List, params, parent)
      case SQL_SYMBOLE.COLUMN_LIST:
        return this.compileColumnList(ast as List, params, parent)
      case SQL_SYMBOLE.VALUE_LIST:
        return this.compileValueList(ast as List, params, parent)
      case SQL_SYMBOLE.EXECUTE_ARGUMENT_LIST:
        return this.compileExecuteArgumentList(ast as List, params, parent)
      case SQL_SYMBOLE.ALIAS:
        return this.compileAlias(ast as Alias, params, parent)
      case SQL_SYMBOLE.IDENTIFIER:
      case SQL_SYMBOLE.BUILDIN_IDENTIFIER:
        return this.compileIdentifier(ast as Identifier<any>, params, parent)
      case SQL_SYMBOLE.EXECUTE:
        return this.compileExecute(ast as Execute, params, parent)
      case SQL_SYMBOLE.INVOKE:
        return this.compileInvoke(ast as Invoke, params, parent)
      case SQL_SYMBOLE.CASE:
        return this.compileCase(ast as Case, params, parent)
      case SQL_SYMBOLE.BINARY_CALCULATE:
        return this.compileBinaryCalculate(ast as BinaryCalculate, params, parent)
      case SQL_SYMBOLE.BINARY_COMPARE:
        return this.compileBinaryCompare(ast as BinaryCompare, params, parent)
      case SQL_SYMBOLE.BINARY_LOGIC:
        return this.compileBinaryLogic(ast as BinaryLogic, params, parent)
      case SQL_SYMBOLE.EXISTS:
        return this.compileExistsCompare(ast as ExistsCompare, params, parent)
      case SQL_SYMBOLE.UNARY_COMPARE:
        return this.compileUnaryCompare(ast as UnaryCompare, params, parent)
      case SQL_SYMBOLE.UNARY_LOGIC:
        return this.compileUnaryLogic(ast as UnaryLogic, params, parent)
      case SQL_SYMBOLE.UNARY_CALCULATE:
        return this.compileUnaryCalculate(ast as UnaryCalculate, params, parent)
      case SQL_SYMBOLE.PARAMETER:
        return this.compileParameter(ast as Parameter, params, parent)
      case SQL_SYMBOLE.VARAINT:
        return this.compileVariant(ast as Variant, params, parent)
      case SQL_SYMBOLE.JOIN:
        return this.compileJoin(ast as Join, params, parent)
      case SQL_SYMBOLE.UNION:
        return this.compileUnion(ast as Union, params, parent)
      case SQL_SYMBOLE.SORT:
        return this.compileSort(ast as SortInfo, params, parent)
      default:
        throw new Error('Error AST type: ' + ast.type)
    }
  }

  protected compileExecute<T extends AST>(exec: Execute, params: Set<Parameter>, parent?: AST): string {
    const returnParam = Parameter.output(RETURN_VALUE_PARAMETER_NAME, Number)
    return 'EXECUTE ' + this.compileAST(returnParam, params, parent) +
      ' = ' + this.compileAST(exec.proc, params, exec) + ' ' +
      this.compileExecuteArgumentList(exec.args, params, exec)
  }

  protected compileBracket<T extends AST>(bracket: Bracket<T>, params: Set<Parameter>, parent?: AST): string {
    return '(' + this.compileAST(bracket.context, params, bracket) + ')'
  }

  protected compileValueList(values: List, params: Set<Parameter>, parent?: AST): string {
    return '(' + values.items.map(ast => this.compileAST(ast, params, values)).join(', ') + ')'
  }

  protected compileColumnList(values: List, params: Set<Parameter>, parent?: AST): string {
    return values.items.map(ast => this.compileAST(ast, params, values)).join(', ')
  }

  protected compileInvokeArgumentList(values: List, params: Set<Parameter>, parent?: AST): string {
    return values.items.map(ast => this.compileAST(ast, params, values)).join(', ')
  }

  protected compileExecuteArgumentList(values: List, params: Set<Parameter>, parent?: AST): string {
    return values.items.map(ast => {
      let sql = this.compileAST(ast, params, values)
      if (ast.type === 'PARAMETER' && (ast as Parameter).direction === PARAMETER_DIRECTION.OUTPUT) {
        sql += ' OUTPUT'
      }
      return sql
    }).join(', ')
  }

  protected compileUnion(union: Union, params: Set<Parameter>, parent?: AST): string {
    return 'UNION ' + union.all ? 'ALL ' : '' + this.compileAST(union.select, params, union)
  }

  protected compileAlias(alias: Alias, params: Set<Parameter>, parent?: AST): string {
    return this.compileAST(alias.expr, params, alias) + ' AS ' + this.quoted(alias.name)
  }

  protected compileCase(caseExpr: Case, params: Set<Parameter>, parent?: AST): string {
    let fragment = 'CASE'
    if (caseExpr.expr) fragment += ' ' + this.compileAST(caseExpr.expr, params, parent)
    fragment += ' ' + caseExpr.whens.map(when => this.compileWhen(when, params, caseExpr))
    if (caseExpr.defaults) fragment += ' ELSE ' + this.compileAST(caseExpr.defaults, params, caseExpr)
    fragment += ' END'
    return fragment
  }

  protected compileWhen(when: When, params: Set<Parameter>, parent?: AST): string {
    return 'WHEN ' + this.compileAST(when.expr, params, when) + ' THEN ' + this.compileAST(when.value, params, when)
  }

  protected compileBinaryLogic(expr: BinaryLogic, params: Set<Parameter>, parent?: AST): string {
    return this.compileAST(expr.left, params, expr) + ' ' + expr.operator + ' ' + this.compileAST(expr.right, params, expr)
  }

  protected compileBinaryCompare(expr: BinaryCompare, params: Set<Parameter>, parent?: AST): string {
    return this.compileAST(expr.left, params, expr) + ' ' + expr.operator + ' ' + this.compileAST(expr.right, params, expr)
  }

  protected compileBinaryCalculate(expr: BinaryCalculate, params: Set<Parameter>, parent?: AST): string {
    return this.compileAST(expr.left, params, expr) + ' ' + expr.operator + ' ' + this.compileAST(expr.right, params, expr)
  }

  protected compileUnaryCompare(expr: UnaryCompare, params: Set<Parameter>, parent?: AST): string {
    return this.compileAST(expr.next, params, expr) + ' ' + expr.operator
  }

  protected compileExistsCompare(expr: ExistsCompare, params: Set<Parameter>, parent?: AST): string {
    return 'EXISTS' + this.compileAST(expr.expr, params, expr)
  }

  protected compileUnaryLogic(expr: UnaryLogic, params: Set<Parameter>, parent?: AST): string {
    return expr.operator + ' ' + this.compileAST(expr.next, params, expr)
  }

  protected compileUnaryCalculate(expr: UnaryCalculate, params: Set<Parameter>, parent?: AST): string {
    return expr.operator + ' ' + this.compileAST(expr.next, params, expr)
  }

  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected compileInvoke(invoke: Invoke, params: Set<Parameter>, parent?: AST): string {
    return `${this.compileAST(invoke.func, params, invoke)}(${(invoke.args.items || []).map(v => this.compileAST(v, params, invoke)).join(', ')})`
  }

  protected compileJoin(join: Join, params: Set<Parameter>, parent?: AST): string {
    return (join.left ? 'LEFT ' : '') + 'JOIN ' + this.compileAST(join.table, params, join) + ' ON ' + this.compileAST(join.on, params, join)
  }

  protected compileSort(sort: SortInfo, params: Set<Parameter>, parent?: AST): string {
    let sql = this.compileAST(sort.expr, params, sort)
    if (sort.direction) sql += ' ' + sort.direction
    return sql
  }

  protected compileSelect(select: Select, params: Set<Parameter>, parent?: AST): string {
    const { tables, top, joins, unions, columns, filters, sorts, groups, havings, offsets, limits, isDistinct } = select
    let sql = 'SELECT '
    if (isDistinct) {
      sql += 'DISTINCT '
    }
    if (_.isNumber(top)) {
      sql += `TOP ${top} `
    }
    sql += columns.items.map(expr => this.compileAST(expr, params, columns)).join(', ')
    if (tables) {
      sql += ' FROM ' + tables.map(table => this.compileAST(table, params, parent)).join(', ')
    }
    if (joins && joins.length > 0) {
      sql += ' ' + joins.map(join => this.compileJoin(join, params, parent)).join(' ')
    }
    if (filters) {
      sql += ' WHERE ' + this.compileAST(filters, params, parent)
    }
    if (groups && groups.length) {
      sql += ' GROUP BY ' + groups.map(p => this.compileAST(p, params, parent)).join(', ')
    }
    if (havings) {
      sql += ' HAVING ' + this.compileAST(havings, params, parent)
    }
    if (sorts && sorts.length > 0) {
      sql += ' ORDER BY ' + sorts.map(sort => this.compileSort(sort, params, parent)).join(', ')
    }

    if (_.isNumber(offsets)) {
      sql += ` OFFSET ${offsets || 0} ROWS`
    }
    if (_.isNumber(limits)) {
      sql += ` FETCH NEXT ${limits} ROWS ONLY`
    }

    if (unions) {
      sql += ' ' + this.compileUnion(unions, params, parent)
    }

    return sql
  }

  protected compileInsert(insert: Insert, params: Set<Parameter>, parent?: AST): string {
    const { table, rows, fields } = insert
    let sql = 'INSERT INTO '

    if (table instanceof Alias) {
      sql += this.compileAST(table.expr, params, parent)
    } else {
      sql += this.compileAST(table, params, parent)
    }
    if (fields) {
      sql += '(' + fields.map(field => this.compileAST(field, params, parent)).join(', ') + ')'
    }

    if (_.isArray(rows)) {
      sql += ' VALUES'
      sql += rows.map(row => this.compileAST(row, params, parent)).join(', ')
    } else {
      sql += ' ' + this.compileAST(rows, params, parent)
    }

    return sql
  }

  protected compileAssignment(assign: Assignment, params: Set<Parameter>, parent?: AST): string {
    const { left, right } = assign
    return this.compileAST(left, params, parent) + ' = ' + this.compileAST(right, params, parent)
  }

  protected compileDeclare(declare: Declare, params: Set<Parameter>, parent?: AST): string {
    return 'DECLARE ' + declare.declares.map(varDec => this.properVariantName(varDec.name) + ' ' + varDec.dataType).join(', ')
  }

  protected compileUpdate(update: Update, params: Set<Parameter>, parent?: AST): string {
    const { table, sets, filters, tables, joins } = update
    assert(table, 'table is required by update statement')
    assert(sets, 'set statement un declared')

    let sql = 'UPDATE '
    // 必须以Identifier解析，否则会生成别名
    sql += this.compileIdentifier(table)

    sql += ' SET ' + sets.map(({ left, right }) => this.compileAST(left, params, update) + ' = ' + this.compileAST(right, params, parent)).join(', ')

    if (tables && tables.length > 0) {
      sql += ' FROM ' + tables.map(table => this.compileAST(table, params, update)).join(', ')
    }

    if (joins && joins.length > 0) {
      sql += ' ' + joins.map(join => this.compileJoin(join, params, update)).join(' ')
    }
    if (filters) {
      sql += ' WHERE ' + this.compileAST(filters, params, update)
    }
    return sql
  }

  protected compileDelete(del: Delete, params: Set<Parameter>, parent?: AST): string {
    const { table, tables, joins, filters } = del
    let sql = 'DELETE '
    if (table) sql += this.compileAST(table, params, parent)
    if (tables && tables.length > 0) {
      sql += ' FROM ' + tables.map(table => this.compileAST(table, params, parent)).join(', ')
    }

    if (joins) {
      sql += joins.map(join => this.compileJoin(join, params, parent)).join(' ')
    }
    if (filters) {
      sql += ' WHERE ' + this.compileAST(filters, params, parent)
    }
    return sql
  }
}

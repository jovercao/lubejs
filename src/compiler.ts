import * as assert from 'assert'
import * as moment from 'moment'
import * as _ from 'lodash'

import {
  AST,
  Parameter,
  Identifier,
  Constant,
  When,
  Column,
  Declare,
  Delete,
  Insert,
  Assignment,
  Update,
  Select,
  ScalarFuncInvoke,
  Case,
  Variant,
  Join,
  Alias,
  Execute,
  Document,
  Union,
  SortInfo,
  UnaryLogicCondition,
  UnaryCompareCondition,
  UnaryOperation,
  BinaryLogicCondition,
  BinaryCompareCondition,
  BinaryOperation,
  ExistsCondition,
  Raw,
  GroupCondition,
  With,
  NamedSelect,
  Func,
  TableFuncInvoke,
  Expression,
  BuildInIdentifier,
  Field,
  JsConstant,
  Name,
  Condition
} from './ast'
import {
  SQL_SYMBOLE,
  PARAMETER_DIRECTION,
  IDENTOFIER_KIND,
  CONDITION_KIND,
  OPERATION_KIND
} from './constants'
import { Operation, Rowset, Star, Table, WithSelect } from './lube'
import { start } from 'repl'
import { BigIntStats } from 'fs'

export interface Command {
  sql: string
  params: Parameter[]
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
  strict?: boolean
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

const RETURN_VALUE_PARAMETER_NAME: string = '__RETURN_VALUE__'

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

  constructor (options?: CompileOptions) {
    this.options = Object.assign({}, DEFAULT_COMPILE_OPTIONS, options)
  }

  protected stringifyName (name: Name<string>, buildIn = false): string {
    if (Array.isArray(name)) {
      return name
        .map((n, index) => {
          if (index < name.length - 1) {
            return this.quoted(n)
          }
          return buildIn ? n : this.quoted(n)
        })
        .join('.')
    }
    return buildIn ? name : this.quoted(name)
  }

  protected stringifyIdentifier (identifier: Identifier<string>): string {
    return this.stringifyName(identifier.$name, identifier.$buildin)
  }

  // /**
  //  * 解析标识符
  //  * @param identifier 标识符
  //  */
  // protected compileIdentifier(
  //   identifier: Identifier<any>,
  //   params?: Set<Parameter>,
  //   parent?: AST
  // ): string {
  //   const sql =
  //     identifier.$type === SQL_SYMBOLE.BUILDIN_IDENTIFIER
  //       ? identifier.$name
  //       : this.quoted(identifier.$name);
  //   const parentNode = Reflect.get(identifier, "parent");
  //   if (parentNode) {
  //     return this.compileIdentifier(parentNode, params, identifier) + "." + sql;
  //   }
  //   return sql;
  // }

  /**
   * 标识符转换，避免关键字被冲突问题
   * @param {string} name 标识符
   */
  private quoted (name: string): string {
    if (this.options.strict) {
      return this.options.quotedLeft + name + this.options.quotedRight
    }
    return name
  }

  /**
   * 向参数列表中添加参数并返回当前参数的参数名
   * @param {array} values 参数列表
   * @param {any} value 参数值
   */
  protected compileParameter (
    param: Parameter<JsConstant, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST = null
  ): string {
    params.add(param)
    return this.pretreatmentParameterName(param)
  }

  public pretreatmentParameterName (p: Parameter<JsConstant, string>) {
    return this.options.parameterPrefix + (p.$name || '')
  }

  protected pretreatmentVariantName (name: string) {
    return this.options.variantPrefix + name
  }

  protected compileVariant (
    variant: Variant<JsConstant, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return this.pretreatmentVariantName(variant.$name)
  }

  /**
   * 编译日期常量
   */
  protected compileDate (date: Date) {
    return "'" + moment(date).format('YYYY-MM-DD HH:mm:ss.SSS') + "'"
  }

  /**
   * 编译Boolean常量
   */
  protected compileBoolean (value: boolean) {
    return value ? '1' : '0'
  }

  /**
   * 编译字符串常量
   */
  protected compileString (value: string) {
    return `'${value.replace(/'/g, "''")}'`
  }

  /**
   * 编译常量
   */
  protected compileConstant (
    constant: Constant<JsConstant>,
    params?: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ) {
    const value = constant.$value
    // 为方便JS，允许undefined进入，留给TS语法检查
    if (value === null || value === undefined) {
      return 'NULL'
    }

    if (typeof value === 'string') {
      return this.compileString(value)
    }

    if (typeof value === 'number' || typeof value === 'bigint') {
      return value.toString(10)
    }

    if (typeof value === 'boolean') {
      return this.compileBoolean(value)
    }

    if (value instanceof Date) {
      return this.compileDate(value)
    }
    if (value instanceof ArrayBuffer || value instanceof SharedArrayBuffer) {
      return '0x' + Buffer.from(value).toString('hex')
    }
    console.debug(value)
    // @ts-ignore
    throw new Error('unsupport constant value type:' + typeof value)
  }

  public compile (ast: AST): Command {
    const params = new Set<Parameter<JsConstant, string>>()
    return {
      sql: this.compileAST(ast, params),
      params: Array.from(params)
    }
  }

  // TODO: 针对JS代码，确定是不需要建立验证规则
  // /**
  //  * 类型检查选项
  //  */
  // expect?: {
  //   /**
  //    * 错误时的警告消息
  //    */
  //   errMsg: string,
  //   /**
  //    * AST验证规则
  //    */
  //   rule: {
  //     $type: SQL_SYMBOLE,
  //     $kind?: IDENTOFIER_KIND
  //   }
  // }
  // if (expect && expect.$type !== ast.$type) {
  //   throw new Error(`Expect AST type ${expect.$type}, but ${ast.$type} found.`)
  // }
  // if (expect && expect.$kind !== identifier.$kind) {
  //   throw new Error(`expect identifier kind: ${expect.$kind}, but ${identifier.$kind} found.`)
  // }

  protected compileAST (
    /**
     * AST
     */
    ast: AST,
    /**
     * 参数容器
     */
    params: Set<Parameter<JsConstant, string>>,
    /**
     * 父级AST
     */
    parent?: AST
  ): string {
    switch (ast.$type) {
      case SQL_SYMBOLE.SELECT:
        return this.compileSelect(ast as Select<any>, params, parent)
      case SQL_SYMBOLE.UPDATE:
        return this.compileUpdate(ast as Update<any>, params, parent)
      case SQL_SYMBOLE.ASSIGNMENT:
        return this.compileAssignment(
          ast as Assignment<JsConstant>,
          params,
          parent
        )
      case SQL_SYMBOLE.INSERT:
        return this.compileInsert(ast as Insert<any>, params, parent)
      case SQL_SYMBOLE.DELETE:
        return this.compileDelete(ast as Delete<any>, params, parent)
      case SQL_SYMBOLE.DECLARE:
        return this.compileDeclare(ast as Declare, params, parent)
      case SQL_SYMBOLE.CONSTANT:
        return this.compileConstant(ast as Constant<JsConstant>, params, parent)
      case SQL_SYMBOLE.IDENTIFIER:
        return this.compileIdentifier(ast, params, parent)
      case SQL_SYMBOLE.EXECUTE:
        return this.compileExecute(ast as Execute<object>, params, parent)
      case SQL_SYMBOLE.SCALAR_FUNCTION_INVOKE:
        return this.compileScalarInvoke(
          ast as ScalarFuncInvoke<JsConstant>,
          params,
          parent
        )
      case SQL_SYMBOLE.TABLE_FUNCTION_INVOKE:
        return this.compileTableInvoke(
          ast as TableFuncInvoke<object>,
          params,
          parent
        )
      case SQL_SYMBOLE.CASE:
        return this.compileCase(ast as Case<any>, params, parent)
      case SQL_SYMBOLE.OPERATION:
        return this.compileOperation(ast, params, parent)
      case SQL_SYMBOLE.CONDITION:
        this.compileCondtion(ast as Condition, params, parent)
      case SQL_SYMBOLE.JOIN:
        return this.compileJoin(ast as Join, params, parent)
      case SQL_SYMBOLE.UNION:
        return this.compileUnion(ast as Union<object>, params, parent)
      case SQL_SYMBOLE.SORT:
        return this.compileSort(ast as SortInfo, params, parent)
      case SQL_SYMBOLE.DOCUMENT:
        return this.compileDocument(ast as Document, params)
      case SQL_SYMBOLE.RAW:
        return (ast as Raw).$sql
      case SQL_SYMBOLE.WITH:
        return this.compileWith(ast as With, params, parent)
      case SQL_SYMBOLE.STAR:
        return this.compileStar(ast as Star<object>, params, parent)
      default:
        throw new Error('Error AST type: ' + ast.$type)
    }
  }

  compileStar (
    star: Star<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    if (star.$parent) {
      return this.compileRowsetName(star.$parent, params, star) + '.*'
    }
    return '*'
  }

  private compileOperation (
    ast: AST,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    switch ((ast as Operation<JsConstant>).$kind) {
      case OPERATION_KIND.BINARY:
        return this.compileBinaryOperation(
          ast as BinaryOperation<JsConstant>,
          params,
          parent
        )
      case OPERATION_KIND.UNARY:
        return this.compileUnaryOperation(
          ast as UnaryOperation<JsConstant>,
          params,
          parent
        )
    }
  }

  compileUnaryOperation (
    opt: UnaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return opt.$operator + this.compileExpression(opt.$value, params, parent)
  }

  private compileIdentifier (
    ast: AST,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    const identifier = ast as Identifier<string>
    switch (identifier.$kind) {
      case IDENTOFIER_KIND.BUILD_IN:
        return this.compileBuildIn(identifier as BuildInIdentifier<string>)
      case IDENTOFIER_KIND.COLUMN:
        return this.compileColumn(
          identifier as Column<JsConstant, string>,
          params,
          parent
        )
      case IDENTOFIER_KIND.TABLE:
        return this.compileRowsetName(
          ast as Table<object, string>,
          params,
          parent
        )
      case IDENTOFIER_KIND.ALIAS:
      case IDENTOFIER_KIND.FIELD:
      case IDENTOFIER_KIND.FUNCTION:
      case IDENTOFIER_KIND.PROCEDURE:
        return this.stringifyIdentifier(identifier)
      case IDENTOFIER_KIND.VARIANT:
        return this.compileVariant(
          identifier as Variant<JsConstant, string>,
          params,
          parent
        )
      case IDENTOFIER_KIND.PARAMETER:
        return this.compileParameter(
          identifier as Parameter<JsConstant, string>,
          params,
          parent
        )
      // case IDENTOFIER_KIND.NAMED_ARGUMENT:
      //   return this.compileNamedArgument(identifier as NamedArgument<JsConstant, string>, params, parent)
    }
  }
  compileRowsetName (
    rowset: Rowset<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    // TODO: 兼容TableVariant
    if (rowset.$alias) {
      return this.stringifyIdentifier(rowset.$alias)
    }
    if (rowset instanceof Table) {
      return this.stringifyIdentifier(rowset)
    }
    throw new Error('行集必须要有名称，否则无法使用！')
  }

  compileNamedSelect (
    rowset: NamedSelect<object, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    return (
      '(' +
      this.compileSelect(rowset.$statement, params, rowset) +
      ') AS ' +
      this.compileRowsetName(rowset, params, parent)
    )
  }

  compileTableInvoke (
    arg0: TableFuncInvoke<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    throw new Error('Method not implemented.')
  }
  // compileNamedArgument(arg0: NamedArgument<JsConstant, string>, params: Set<Parameter<JsConstant, string>>, parent: AST): string {
  //   throw new Error("Method not implemented.");
  // }
  compileBuildIn (buildIn: BuildInIdentifier<string>): string {
    return buildIn.$name
  }
  compileColumn (
    column: Column<JsConstant, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return `${this.compileAST(column.$expr, params, column)} AS ${this.quoted(
      column.$name
    )}`
  }

  compileWithSelect (
    item: WithSelect<any, string>,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    return `${this.quoted(item.$alias.$name)} AS (${this.compileAST(
      item.$statement,
      params,
      parent
    )})`
  }

  compileWith (
    withs: With,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ): string {
    return (
      'WITH ' +
      withs.$items
        .map(item => this.compileWithSelect(item, params, withs))
        .join(', ')
    )
  }

  protected compileDocument (
    doc: Document,
    params: Set<Parameter<JsConstant, string>>
  ) {
    return doc.statements
      .map(statement => this.compileAST(statement, params, doc))
      .join('\n')
  }

  protected compileExecute<T extends AST> (
    exec: Execute<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const returnParam = Parameter.output(RETURN_VALUE_PARAMETER_NAME, Number)
    return (
      'EXECUTE ' +
      this.compileAST(returnParam, params, parent) +
      ' = ' +
      this.compileAST(exec.$proc, params, exec) +
      ' ' +
      this.compileExecuteArgumentList(exec.$args, params, exec)
    )
  }

  protected compileInvokeArgumentList (
    args: Expression<JsConstant>[],
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return args
      .map(expr => this.compileExpression(expr, params, parent))
      .join(', ')
  }

  protected compileExecuteArgumentList (
    args: Expression<JsConstant>[],
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return args
      .map(ast => {
        let sql = this.compileAST(ast, params, parent)
        if (
          ast instanceof Parameter &&
          (ast as Parameter<JsConstant, string>).$direction ===
            PARAMETER_DIRECTION.OUTPUT
        ) {
          sql += ' OUTPUT'
        }
        return sql
      })
      .join(', ')
  }

  protected compileUnion (
    union: Union<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      'UNION ' +
      (union.$all ? 'ALL ' : '') +
      this.compileAST(union.$select, params, union)
    )
  }

  protected compileCase (
    caseExpr: Case<any>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    let fragment = 'CASE'
    if (caseExpr.$expr)
      fragment += ' ' + this.compileAST(caseExpr.$expr, params, parent)
    fragment +=
      ' ' +
      caseExpr.$whens.map(when => this.compileWhen(when, params, caseExpr))
    if (caseExpr.$default)
      fragment +=
        ' ELSE ' + this.compileAST(caseExpr.$default, params, caseExpr)
    fragment += ' END'
    return fragment
  }

  protected compileWhen (
    when: When<any>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      'WHEN ' +
      this.compileAST(when.$expr, params, when) +
      ' THEN ' +
      this.compileAST(when.$value, params, when)
    )
  }

  protected compileGroupCondition (
    expr: GroupCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return '(' + this.compileAST(expr.context, params, expr) + ')'
  }

  protected compileBinaryLogicCondition (
    expr: BinaryLogicCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileAST(expr.$left, params, expr) +
      ' ' +
      expr.$operator +
      ' ' +
      this.compileAST(expr.$right, params, expr)
    )
  }

  protected compileBinaryCompareCondition (
    expr: BinaryCompareCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileAST(expr.$left, params, expr) +
      ' ' +
      expr.$operator +
      ' ' +
      (Array.isArray(expr.$right)
        ? '(' +
          expr.$right.map(p => this.compileExpression(p, params, expr)) +
          ')'
        : this.compileExpression(expr.$right, params, expr))
    )
  }

  protected compileBinaryOperation (
    expr: BinaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      this.compileAST(expr.$left, params, expr) +
      ' ' +
      expr.$operator +
      ' ' +
      this.compileAST(expr.$right, params, expr)
    )
  }

  protected compileUnaryCompareCondition (
    expr: UnaryCompareCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return this.compileAST(expr.$expr, params, expr) + ' ' + expr.$operator
  }

  protected compileExistsCondition (
    expr: ExistsCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return 'EXISTS' + this.compileAST(expr.$statement, params, expr)
  }

  protected compileUnaryLogicCondition (
    expr: UnaryLogicCondition,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return expr.$operator + ' ' + this.compileAST(expr.$condition, params, expr)
  }

  // TODO: 是否需要类型判断以优化性能
  protected compileExpression (
    expr: Expression<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ) {
    return this.compileAST(expr, params, parent)
  }

  protected compileUnaryCalculate (
    expr: UnaryOperation<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return expr.$operator + ' ' + this.compileAST(expr.$value, params, expr)
  }

  /**
   * 函数调用
   * @param {*} invoke
   * @param {*} params
   * @returns
   * @memberof Executor
   */
  protected compileScalarInvoke (
    invoke: ScalarFuncInvoke<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return `${this.stringifyIdentifier(invoke.$func)}(${(invoke.$args || [])
      .map(v => this.compileAST(v, params, invoke))
      .join(', ')})`
  }

  protected compileJoin (
    join: Join,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      (join.$left ? 'LEFT ' : '') +
      'JOIN ' +
      this.compileAST(join.$table, params, join) +
      ' ON ' +
      this.compileAST(join.$on, params, join)
    )
  }

  protected compileSort (
    sort: SortInfo,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    let sql = this.compileAST(sort.$expr, params, sort)
    if (sort.$direction) sql += ' ' + sort.$direction
    return sql
  }

  protected compileSelect (
    select: Select<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const {
      $froms,
      $top,
      $joins,
      $union,
      $columns,
      $where,
      $sorts,
      $groups,
      $having,
      $offset,
      $limit,
      $distinct
    } = select
    let sql = 'SELECT '
    if ($distinct) {
      sql += 'DISTINCT '
    }
    if (_.isNumber($top)) {
      sql += `TOP ${$top} `
    }
    sql += $columns
      .map(col => this.compileColumn(col, params, select))
      .join(', ')
    if ($froms) {
      sql +=
        ' FROM ' +
        $froms
          .map(table => {
            // 如果是命名行集
            if (table instanceof NamedSelect) {
              return this.compileNamedSelect(table, params, select)
            }
            return this.compileRowsetName(table, params, select)
          })
          .join(', ')
    }
    if ($joins && $joins.length > 0) {
      sql +=
        ' ' +
        $joins.map(join => this.compileJoin(join, params, parent)).join(' ')
    }
    if ($where) {
      sql += ' WHERE ' + this.compileCondtion($where, params, parent)
    }
    if ($groups && $groups.length) {
      sql +=
        ' GROUP BY ' +
        $groups.map(p => this.compileAST(p, params, parent)).join(', ')
    }
    if ($having) {
      sql += ' HAVING ' + this.compileAST($having, params, parent)
    }
    if ($sorts && $sorts.length > 0) {
      sql +=
        ' ORDER BY ' +
        $sorts.map(sort => this.compileSort(sort, params, parent)).join(', ')
    }

    if (_.isNumber($offset)) {
      sql += ` OFFSET ${$offset || 0} ROWS`
    }
    if (_.isNumber($limit)) {
      sql += ` FETCH NEXT ${$limit} ROWS ONLY`
    }

    if ($union) {
      sql += ' ' + this.compileUnion($union, params, select)
    }

    return sql
  }
  compileCondtion (
    where: Condition,
    params: Set<Parameter<JsConstant, string>>,
    parent: AST
  ) {
    switch (where.$kind) {
      case CONDITION_KIND.EXISTS:
        return this.compileExistsCondition(
          where as ExistsCondition,
          params,
          parent
        )
      case CONDITION_KIND.GROUP:
        return this.compileGroupCondition(
          where as GroupCondition,
          params,
          parent
        )
      case CONDITION_KIND.BINARY_COMPARE:
        return this.compileBinaryCompareCondition(
          where as BinaryCompareCondition,
          params,
          parent
        )
      case CONDITION_KIND.UNARY_COMPARE:
        return this.compileUnaryCompareCondition(
          where as UnaryCompareCondition,
          params,
          parent
        )
      case CONDITION_KIND.BINARY_LOGIC:
        return this.compileBinaryLogicCondition(
          where as BinaryLogicCondition,
          params,
          parent
        )
      case CONDITION_KIND.UNARY_LOGIC:
        return this.compileUnaryLogicCondition(
          where as UnaryLogicCondition,
          params,
          parent
        )
    }
  }

  protected compileInsert (
    insert: Insert<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { $table, $values, $fields } = insert
    let sql = 'INSERT INTO '

    sql += this.compileRowsetName($table, params, parent)

    if ($fields) {
      sql +=
        '(' +
        $fields
          .map(field => this.compileAST(field, params, parent))
          .join(', ') +
        ')'
    }

    if (Array.isArray($values)) {
      sql += ' VALUES'
      sql += $values
        .map(
          row =>
            '(' +
            row
              .map(expr => this.compileExpression(expr, params, parent) + ')')
              .join(', ')
        )
        .join(', ')
    } else {
      sql += ' ' + this.compileAST($values, params, parent)
    }

    return sql
  }

  protected compileAssignment (
    assign: Assignment<JsConstant>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { left, right } = assign
    return (
      this.compileExpression(left, params, parent) +
      ' = ' +
      this.compileExpression(right, params, parent)
    )
  }

  protected compileDeclare (
    declare: Declare,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    return (
      'DECLARE ' +
      declare.$declares
        .map(
          varDec =>
            this.pretreatmentVariantName(varDec.$name) + ' ' + varDec.$dataType
        )
        .join(', ')
    )
  }

  protected compileUpdate (
    update: Update<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { $table, $sets: sets, $where, $froms, $joins } = update
    assert($table, 'table is required by update statement')
    assert(sets, 'set statement un declared')

    let sql = 'UPDATE '
    sql += this.compileRowsetName($table, params, parent)

    sql +=
      ' SET ' +
      sets
        .map(
          ({ left, right }) =>
            this.compileAST(left, params, update) +
            ' = ' +
            this.compileAST(right, params, parent)
        )
        .join(', ')

    if ($froms && $froms.length > 0) {
      sql +=
        ' FROM ' +
        $froms.map(table => this.compileAST(table, params, update)).join(', ')
    }

    if ($joins && $joins.length > 0) {
      sql +=
        ' ' +
        $joins.map(join => this.compileJoin(join, params, update)).join(' ')
    }
    if ($where) {
      sql += ' WHERE ' + this.compileAST($where, params, update)
    }
    return sql
  }

  protected compileDelete (
    del: Delete<object>,
    params: Set<Parameter<JsConstant, string>>,
    parent?: AST
  ): string {
    const { $table, $froms, $joins, $where } = del
    let sql = 'DELETE '
    if ($table) sql += this.compileAST($table, params, parent)
    if ($froms && $froms.length > 0) {
      sql +=
        ' FROM ' +
        $froms.map(table => this.compileAST(table, params, parent)).join(', ')
    }

    if ($joins) {
      sql += $joins.map(join => this.compileJoin(join, params, parent)).join(' ')
    }
    if ($where) {
      sql += ' WHERE ' + this.compileAST($where, params, parent)
    }
    return sql
  }
}

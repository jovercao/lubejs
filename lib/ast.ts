/**
 * lodash
 */
import * as _ from 'lodash'

import {
  assert,
  ensureConstant,
  ensureCondition,
  ensureIdentity,
  // assertType,
  // assertValue
} from './util'

import {
  ComputeOperator,
  ParameterDirection,
  SqlSymbol,
  CompareOperator,
  SortDirection,
  LogicOperator,
} from './constants'

// **********************************类型声明******************************************

/**
 * JS常量类型
 */
export type JsConstant = String | Date | Boolean | null | undefined | Number;

/**
 * 带括号的查询条件
 */
export type BracketCondition = Bracket<Condition>;

/**
 * 括号表达式
 */
export type BracketExpression = Bracket<Expression>;

/**
 * 兼容包含括号的表达式类型
 */
export type Expressions = Expression | Bracket<Expression | BracketExpression>

/**
 * 未经确认的表达式
 */
export type UnsureExpressions = Expressions | JsConstant
/**
 * 查询条件列表
 */
export type Conditions = Condition | Bracket<Condition | BracketCondition>

export type UnsureConditions = Conditions | object
/**
 * SELECT查询表达式
 */
export type SelectExpression = Bracket<Select>

export type InsertValues = (UnsureExpressions[] | object)[]

export type UnsureGroupValues = UnsureExpressions[] | Bracket<Expressions[]>

export type UnsureIdentity = Identity | string

export interface SortInfo {
  $expr: Expressions,
  $direction: SortDirection
}

/**
 * AST 基类
 */
export abstract class AST {
  constructor(type: SqlSymbol) {
    this.$type = type
  }

  readonly $type: SqlSymbol
}

/**
 * 表达式基类，抽象类
 * @class Expression
 * @extends {AST}
 */
export abstract class Expression extends AST {
  /**
   * 获取当前表达式是否为左值
   * @type {boolean}
   */
  abstract get lvalue(): boolean

  /**
   * 加法运算
   */
  add(exp: UnsureExpressions) {
    return Expression.add(this, exp)
  }

  /**
   * 减法运算
   */
  sub(exp: UnsureExpressions) {
    return Expression.sub(this, exp)
  }

  /**
   * 乘法运算
   * @param exp 要与当前表达式相乘的表达式
   */
  mul(exp: UnsureExpressions) {
    return Expression.mul(this, exp)
  }

  /**
   * 除法运算
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(exp: UnsureExpressions) {
    return Expression.div(this, exp)
  }

  /**
   * 算术运算 %
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(exp: UnsureExpressions) {
    return Expression.mod(this, exp)
  }

  /**
   * 位运算 &
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(exp: UnsureExpressions) {
    return Expression.and(this, exp)
  }

  /**
   * 位运算 |
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(exp: UnsureExpressions) {
    return Expression.or(this, exp)
  }

  /**
   * 位运算 ~
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not(exp: UnsureExpressions) {
    return Expression.not(this, exp)
  }

  /**
   * 位运算 ^
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(exp: UnsureExpressions) {
    return Expression.xor(this, exp)
  }

  /**
   * 位运算 <<
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(exp: UnsureExpressions) {
    return Expression.shl(this, exp)
  }

  /**
   * 位运算 >>
   * @param exp 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(exp: UnsureExpressions) {
    return Expression.shr(this, exp)
  }

  /**
   * 比较是否相等 =
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(exp: UnsureExpressions) {
    return Condition.eq(this, exp)
  }

  /**
   * 比较是否不等于 <>
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(exp: UnsureExpressions) {
    return Condition.neq(this, exp)
  }

  /**
   * 比较是否小于 <
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(exp: UnsureExpressions) {
    return Condition.lt(this, exp)
  }

  /**
   * 比较是否小于等于 <=
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(exp: UnsureExpressions) {
    return Condition.lte(this, exp)
  }

  /**
   * 比较是否大于 >
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(exp: UnsureExpressions) {
    return Condition.gt(this, exp)
  }

  /**
   * 比较是否小于等于 >=
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(exp: UnsureExpressions) {
    return Condition.gte(this, exp)
  }

  /**
   * 比较是相像 LIKE
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(exp: UnsureExpressions) {
    return Condition.like(this, exp)
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param exp 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(exp: UnsureExpressions) {
    return Condition.notLike(this, exp)
  }

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(...values: UnsureExpressions[]) {
    return Condition.in(this, values)
  }

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(...values: UnsureExpressions[]) {
    return Condition.notIn(this, values)
  }

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull() {
    return Condition.isNull(this)
  }

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull() {
    return Condition.isNotNull(this)
  }

  /**
   * isNotNull 的简称别名
   * @returns 返回对比条件表达式
   */
  notNull() {
    return this.isNotNull()
  }

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc(): SortInfo {
    return {
      $expr: this,
      $direction: SortDirection.ASC
    }
  }

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc(): SortInfo {
    return {
      $expr: this,
      $direction: SortDirection.DESC
    }
  }

  /**
   * 为当前表达式添加别名
   */
  as(alias: string): Alias<Expressions> {
    return new Alias(this, alias)
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static add(left, right) {
    return new BinaryComputeExpression(ComputeOperator.ADD, left, right)
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub(left, right) {
    return new BinaryComputeExpression(ComputeOperator.SUB, left, right)
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul(left, right) {
    return new BinaryComputeExpression(ComputeOperator.MUL, left, right)
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div(left, right) {
    return new BinaryComputeExpression(ComputeOperator.DIV, left, right)
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod(left, right) {
    return new BinaryComputeExpression(ComputeOperator.MOD, left, right)
  }

  /**
   * 位算术运算 &
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static and(left, right) {
    return new BinaryComputeExpression(ComputeOperator.BITAND, left, right)
  }

  /**
   * 位算术运算 |
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static or(left, right) {
    return new BinaryComputeExpression(ComputeOperator.BITOR, left, right)
  }

  /**
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor(left, right) {
    return new BinaryComputeExpression(ComputeOperator.BITXOR, left, right)
  }

  /**
   * 位算术运算 ~
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not(left, right) {
    return new BinaryComputeExpression(ComputeOperator.BITNOT, left, right)
  }

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl(left, right) {
    return new BinaryComputeExpression(ComputeOperator.SHL, left, right)
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr(left, right) {
    return new BinaryComputeExpression(ComputeOperator.SHR, left, right)
  }
}

/**
 * 查询条件
 */
export abstract class Condition extends AST {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition) {
    condition = ensureCondition(condition)
    return new BinaryLogicCondition(LogicOperator.AND, this, condition)
  }

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition) {
    condition = ensureCondition(condition)
    return new BinaryLogicCondition(LogicOperator.OR, this, condition)
  }

  /**
   * @returns {Bracket<Condition>}
   */
  enclose() {
    return new Bracket(this)
  }

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new BinaryLogicCondition(LogicOperator.AND, previous, current)
    })
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static or(...conditions) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new BinaryLogicCondition(LogicOperator.OR, previous, current)
    })
  }

  /**
   * Not 逻辑运算
   * @param condition
   * @returns {NotCondition}
   */
  static not(condition) {
    condition = ensureCondition(condition)
    return new UnaryLogicCondition(LogicOperator.NOT, condition)
  }



  /**
   * 判断是否存在
   * @param select 查询语句
   */
  static exists(select: Select) {
    return new UnaryCompareCondition(CompareOperator.EXISTS, select.enclose())
  }

  /**
   * 比较运算
   * @private
   * @param left 左值
   * @param right 右值
   * @param operator 运算符
   * @returns 返回比较运算对比条件
   */
  static _compare(left: UnsureExpressions, right: UnsureExpressions, operator: CompareOperator = CompareOperator.EQ) {
    return new BinaryCompareCondition(operator, left, right)
  }

  /**
   * 比较运算 =
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static eq(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.EQ)
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.NEQ)
  }

  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lt(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.LT)
  }

  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.LTE)
  }

  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.GT)
  }

  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.GTE)
  }

  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static like(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.LIKE)
  }

  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static notLike(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition._compare(left, right, CompareOperator.NOT_LIKE)
  }

  /**
   * 比较运算 IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static in(left: UnsureExpressions, values: UnsureGroupValues) {
    let group
    if (values instanceof Bracket) {
      group = values
    } else {
      group = new Bracket(values)
    }
    return Condition._compare(left, group, CompareOperator.IN)
  }

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn(left: UnsureExpressions, values: UnsureGroupValues) {
    let group
    if (values instanceof Bracket) {
      group = values
    } else {
      group = new Bracket(values)
    }
    return Condition._compare(left, group, CompareOperator.NOT_IN)
  }

  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  static isNull(expr: UnsureExpressions) {
    return new IsNullCondition(expr)
  }

  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  static isNotNull(expr: UnsureExpressions) {
    return new IsNotNullCondition(expr)
  }
}


/**
 * 二元逻辑查询条件条件
 */
export class BinaryLogicCondition extends Condition {
  $opeartor: LogicOperator
  $left: Conditions
  $right: Conditions
  /**
   * 创建二元逻辑查询条件实例
   */
  constructor(operator: LogicOperator, left: UnsureConditions, right: UnsureConditions) {
    super(SqlSymbol.BINARY)
    this.$opeartor = operator
    /**
     * 左查询条件
     */
    this.$left = ensureCondition(left)
    /**
     * 右查询条件
     */
    this.$right = ensureCondition(right)
  }
}

/**
 * 一元逻辑查询条件
 */
class UnaryLogicCondition extends Condition {
  $operator: LogicOperator
  $next: Conditions
  /**
   * 创建一元逻辑查询条件实例
   * @param operator
   * @param next
   */
  constructor(operator, next) {
    super(SqlSymbol.UNARY)
    this.$operator = operator
    this.$next = ensureCondition(next)
  }
}


/**
 * 二元比较条件
 */
class BinaryCompareCondition extends Condition {
  $left: Expressions
  $right: Expressions
  $operator: CompareOperator
  /**
   * 构造函数
   */
  constructor(operator: CompareOperator, left: UnsureExpressions, right: UnsureExpressions) {
    super(SqlSymbol.BINARY)
    this.$operator = operator
    assert(left, 'Left must not null')
    assert(right, 'Right must not null')
    this.$left = ensureConstant(left)
    this.$right = ensureConstant(right)
  }
}

/**
 * 一元比较条件
 */
class UnaryCompareCondition extends Condition {
  $condition: Conditions
  $operator: CompareOperator
  /**
   * 一元比较运算符
   * @param operator 运算符
   * @param expr 查询条件
   */
  constructor(operator: CompareOperator, expr: UnsureConditions) {
    super(SqlSymbol.UNARY)
    this.$operator = operator
    assert(expr, 'next must not null')
    this.$condition = ensureCondition(expr)
  }
}

/**
 * IS NULL 运算
 */
class IsNullCondition extends UnaryCompareCondition {
  /**
   * @param expr 下一查询条件
   */
  constructor(expr: UnsureConditions) {
    super(CompareOperator.IS_NULL, expr)
  }
}

/**
 * 是否为空值条件
 */
class IsNotNullCondition extends UnaryLogicCondition {
  /**
   * 是否空值
   * @param expr
   */
  constructor(expr: UnsureConditions) {
    super(CompareOperator.IS_NOT_NULL, expr)
  }
}

/**
 * 联接查询
 * @class Join
 * @extends {AST}
 */
class Join extends AST {
  readonly $type: SqlSymbol
  $left: boolean
  $table: Identity
  $on: Conditions

  /**
   * 创建一个表关联
   * @param table
   * @param on 关联条件
   * @param left 是否左联接
   * @field
   */
  constructor(table: UnsureIdentity, on: Conditions, left: boolean = false) {
    super(SqlSymbol.JOIN)

    /**
     * 关联表
    * @type {Table}
    */
    this.$table = ensureIdentity(table)
    /**
     * 关联条件
    * @type {Conditions}
    */
    this.$on = ensureCondition(on)

    /**
     * 是否左联接
     * @type {boolean}
     */
    this.$left = left
  }
}

/**
 * 标识符，可以多级，如表名等
 */
export class Identity extends Expression {

  // [name: string]: Identity

  public readonly $name: string
  public readonly $parent?: Identity
  /**
   * 标识符
   */
  constructor(name: string, parent?: Identity) {
    super(SqlSymbol.IDENTITY)
    this.$name = name
    this.$parent = parent
  }

  get lvalue() {
    return true
  }

  /**
   * 访问下一节点
   * @param name
   */
  dot(name: string) {
    return new Identity(name, this)
  }
}

/**
 * 别名表达式
 */
export class Alias<T extends Expression> extends Identity {
  /**
   * 表达式
   */
  readonly $expr: Expressions

  /**
   * 别名构造函数
   * @param expr 表达式或表名
   * @param name 别名
   */
  constructor(expr: UnsureExpressions, name: string) {
    super(name)
    assert(_.isString(name), 'The alias must type of string')
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
    this.$expr = ensureConstant(expr)
  }
}

/**
 * 函数调用表达式
 */
export class Invoke extends Expression {

  get lvalue() {
    return false
  }

  $func: Identity

  $params: Expression[]

  /**
   * 函数调用
   */
  constructor(func: Identity, params: (Expression | JsConstant)[]) {
    super(SqlSymbol.INVOKE)
    this.$func = func
    this.$params = params.map(exp => ensureConstant(exp))
  }
}

/**
 * SQL 语句
 */
export abstract class Statement extends AST {

}

/**
 * When语句
 */
export class When extends AST {
  $expr: Expressions
  $value: Expressions

  constructor(expr: Expressions, value: Expressions) {
    super(SqlSymbol.WHEN)
    this.$expr = ensureConstant(expr)
    this.$value = ensureConstant(value)
  }
}

/**
 * CASE表达式
 */
export class Case extends Expression {

  get lvalue() {
    return false
  }

  $expr: Expressions
  $whens: When[]
  $default: Expressions

  /**
   *
   * @param expr
   */
  constructor(expr) {
    super(SqlSymbol.CASE)
    this.$expr = expr
    /**
     * @type {When[]}
     */
    this.$whens = []
  }

  /**
   * ELSE语句
   * @param defaults
   */
  else(defaults) {
    this.$default = ensureConstant(defaults)
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(expr: UnsureExpressions, then) {
    this.$whens.push(
      new When(ensureConstant(expr), then)
    )
  }
}

/**
 * 常量表达式
 */
export class Constant extends Expression {

  get lvalue() {
    return false
  }

  /**
   * 实际值
   */
  $value: JsConstant

  constructor(value: JsConstant) {
    super(SqlSymbol.CONSTANT)
    this.$value = value
  }
}

/**
 * 括号引用
 */
export class Bracket<T> extends Expression {
  /**
   * 表达式
   */
  $context: T

  get lvalue() {
    return false
  }

  constructor(context: T) {
    super(SqlSymbol.BRACKET)
    this.$context = context
  }
}

/**
 * 二元运算表达式
 */
export class BinaryComputeExpression extends Expression {

  get lvalue() {
    return false
  }

  $operator: ComputeOperator
  $left: Expressions
  $right: Expressions


  /**
   * 名称
   * @param operator 运算符
   * @param left 左值
   * @param right 右值
   */
  constructor(operator: ComputeOperator, left: UnsureExpressions, right: UnsureExpressions) {
    super(SqlSymbol.BINARY)
    assert(left, 'The argument left must not null')
    assert(right, 'The arguemnt right must not null')
    this.$operator = operator
    /**
     * @type {Expressions}
     */
    this.$left = ensureConstant(left)
    /**
     * @type {Expressions}
     */
    this.$right = ensureConstant(right)
  }
}

/**
 * - 运算符
 */
export class UnaryComputeExpression extends Expression {

  $operator: ComputeOperator
  $expr: Expressions
  readonly $type: SqlSymbol

  get lvalue() {
    return false
  }
  /**
   * 一元运算目前只支持负数运算符
   * @param expr
   */
  constructor(operator: ComputeOperator, expr: UnsureExpressions) {
    super(SqlSymbol.UNARY)
    this.$type = SqlSymbol.UNARY
    /**
     * @type {Expressions}
     */
    this.$expr = ensureConstant(expr)
  }
}

/**
 * 联接查询
 */
class Union extends AST {
  $select: SelectExpression
  $all: boolean
  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select, all) {
    super(SqlSymbol.UNION)
    this.$select = select
    this.$all = all
  }
}

interface SelectOptions {
  from?: UnsureIdentity[],
  top?: number,
  offset?: number,
  limit?: number,
  distinct?: boolean,
  columns?: UnsureExpressions[],
  joins?: Join[],
  where?: Conditions,
  orderBy?: (SortInfo | UnsureExpressions)[],
  groupBy?: UnsureExpressions[]
}

interface SortObject {
  [key: string]: SortDirection
}

/**
 * SELECT查询
 * @class Select
 * @extends {Statement}
 */
export class Select extends Statement {
  $from: Identity[]
  $top?: number
  $offset?: number
  $limit?: number
  $distinct?: boolean
  $columns: Expressions[]
  $joins?: Join[]
  $where?: Conditions
  $orderBy?: SortInfo[]
  $groupBy?: Expressions[]
  $having?: Conditions
  $union?: Union

  constructor(options?: SelectOptions) {
    super(SqlSymbol.SELECT)
    if (options?.from) this.from(...options.from)
    if (options?.joins) this.$joins = options.joins
    if (options?.columns) this.columns(...options.columns)
    if (options?.where) this.where(options.where)
    if (options?.orderBy) this.orderBy(...options.orderBy)
    if (options?.groupBy) this.groupBy(...options.groupBy)
    if (options?.distinct === true) this.distinct()
    if (options?.top !== undefined) this.top(options.top)
    if (options?.offset !== undefined) this.offset(options.offset)
    if (options?.limit !== undefined) this.offset(options.limit)
  }

  /**
   * 选择列
   */
  columns(columns: object)
  columns(...columns: UnsureExpressions[])
  columns(...columns: (object | UnsureConditions)[]) {
    assert(!this.$columns, 'columns is declared')
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      const obj = columns[0]
      this.$columns = Object.entries(obj).map(([alias, expr]) => new Alias(ensureConstant(expr), alias))
      return this
    }
    // 实例化
    this.$columns = (columns as UnsureExpressions[]).map(expr => ensureConstant(expr))
    return this
  }

  /**
   * 去除重复的
   */
  distinct() {
    this.$distinct = true
    return this
  }

  /**
   * TOP
   * @param rows 行数
   */
  top(rows) {
    assert(_.isUndefined(this.$top), 'top is declared')
    this.$top = rows
    return this
  }

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables) {
    // assert(!this.$from, 'from已经声明')
    this.$from = tables.map(table => ensureIdentity(table))
    return this
  }

  /**
   * 表联接
   * @param table
   * @param on
   * @param left
   * @memberof Select
   */
  join(table: UnsureIdentity, on: Conditions, left = false) {
    assert(this.$from, 'join must after from clause')
    if (!this.$joins) {
      this.$joins = []
    }
    this.$joins.push(
      new Join(table, on, left)
    )
    return this
  }

  /**
   * 左联接
   * @param table
   * @param on
   */
  leftJoin(table: UnsureIdentity, on: Conditions) {
    return this.join(table, on, true)
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition) {
    assert(!this.$where, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = ensureCondition(condition)
    }
    assert(condition instanceof Condition, 'Then argument condition must type of Condition')
    this.$where = condition
    return this
  }

  /**
   * order by 排序
   * @param sorts 排序信息
   */
  orderBy(sorts: SortObject): Select
  orderBy(...sorts: (SortInfo | UnsureExpressions)[]): Select
  orderBy(...sorts: (SortObject | SortInfo | UnsureExpressions)[]): Select {
    // assert(!this.$orders, 'order by clause is declared')
    assert(sorts.length > 0, 'must have one or more order basis')
    // 如果传入的是对象类型
    if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
      const obj = sorts[0]
      this.$orderBy = Object.entries(obj).map(([expr, direction]) => ({
        $expr: new Identity(expr),
        $direction: direction
      }))
      return this
    }
    sorts = sorts as (UnsureExpressions | SortInfo)[]
    this.$orderBy = sorts.map(
      expr => _.isObject(expr) ? (expr as SortInfo) : {
        $expr: ensureConstant(expr as UnsureExpressions),
        $direction: SortDirection.ASC
      }
    )
    return this
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: UnsureExpressions[]) {
    this.$groupBy = groups.map(expr => ensureConstant(expr))
    return this
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition) {
    assert(!this.$having, 'having is declared')
    assert(this.$groupBy, 'Syntax error, group by is not declared.')
    if (!(condition instanceof Condition)) {
      condition = ensureCondition(condition)
    }
    this.$having = condition
    return this
  }

  /**
   * 偏移数
   * @param rows
   */
  offset(rows) {
    this.$offset = rows
    return this
  }

  /**
   * 限定数
   * @param rows
   */
  limit(rows) {
    assert(_.isNumber(rows), 'The argument rows must type of Number')
    this.$limit = rows
    return this
  }

  /**
   * 合并查询
   */
  union(select: SelectExpression, all = false) {
    this.$union = new Union(select, all)
  }

  unionAll(select: SelectExpression) {
    return this.union(select, true)
  }

  /**
   * 将本SELECT返回表达式
   * @returns 返回一个加()后的SELECT语句
   */
  enclose() {
    return new Bracket(this)
  }

  /**
   * 将本次查询，转换为Table行集
   * @param alias
   */
  as(alias) {
    return new Alias(this.enclose(), alias)
  }
}

interface InsertOptions {
  table?: Identity
  fields?: (string | Identity)[]
  values?: InsertValues
}

/**
 * Insert 语句
 */
export class Insert extends Statement {

  $table: Identity
  $fields: Identity[]
  $values: Expressions[][] | Select

  /**
   * 构造函数
   */
  constructor(options?: InsertOptions) {
    super(SqlSymbol.INSERT)
    if (options?.table) {
      this.into(options.table)
    }
    if (options?.fields) {
      this.fields(...options.fields)
    }
    if (options?.values) {
      this.values(options.values)
    }
  }

  /**
   * 插入至表
   * @param table
   * @param fields
   */
  into(table: Identity) {
    assert(!this.$table, 'The into clause is declared')
    this.$table = ensureIdentity(table)
    return this
  }

  /**
   * 字段列表
   * @param  {string[]|Field[]} fields
   */
  fields(...fields: UnsureIdentity[]) {
    assert(fields.length > 0, 'fields not allow empty.')
    /**
     * 字段列表
     * @type {Expression[]}
     */
    this.$fields = fields.map(p => ensureIdentity(p))
    return this
  }

  values(select: Select)
  values(rows: object[])
  values(row: UnsureExpressions[])
  values(...rows: UnsureExpressions[][])
  values(...rows: object[])
  values(...rows: (Select | object | UnsureExpressions[])[]) {
    assert(!this.$values, 'values is declared')
    assert(rows.length > 0, 'rows must more than one elements.')
    if (rows.length === 1 && rows[0] instanceof Select) {
      this.$values = rows[0]
      return this
    }

    const findedFields = {}

    if (rows.length === 1 && !this.$fields) {
      this.fields(...Object.keys(rows[0]))
    }
    if (!this.$fields) {
      throw new Error('Multi rows must declare field')
    }


    this.$values = rows.map(row => {
      if (_.isArray(row)) {
        return row.map(expr => ensureConstant(expr))
      }
      if (_.isPlainObject(row)) {
        return this.$fields.map(key => ensureConstant(row[key.$name]))
      }
      throw new Error('Invalid type')
    })
    return this
  }
}

interface UpdateOptions {
  table?: UnsureIdentity
  sets?: object | Assignment[]
  joins?: Join[]
  where?: Conditions
}

export class Update extends AST {
  $table: Identity
  $where: Conditions
  $joins?: Join[]
  $sets: Assignment[]

  constructor(options?: UpdateOptions) {
    super(SqlSymbol.UPDATE)
    if (options?.table) this.from(options.table)
    if (options?.sets) this.set(options.sets)
    if (options?.where) this.where(options.where)
    if (options?.joins) this.$joins = options.joins
  }

  from(table: UnsureIdentity) {
    assert(!this.$table, 'from table已经声明')
    this.$table = ensureIdentity(table)
    return this
  }

  /**
   * 内联接
   * @param table
   * @param on
   * @param left
   * @memberof Select
   */
  join(table: UnsureIdentity, on: Conditions = null, left: boolean = false) {
    assert(this.$table, 'join must after from clause')
    if (!this.$joins) {
      this.$joins = []
    }
    this.$joins.push(
      new Join(table, on, left)
    )
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  /**
   * @param sets
   */
  set(sets: object)
  set(...sets: Assignment[])
  set(...sets: (object | Assignment)[]) {
    assert(!this.$sets, 'set statement is declared')
    assert(sets.length > 0, 'sets must have more than 0 items')
    if (sets.length === 1 && _.isPlainObject(sets[0])) {
      const obj = sets[0] as object
      this.$sets = Object.entries(obj).map(
        ([key, value]) => new Assignment(new Identity(key), ensureConstant(value))
      )
      return this
    }

    this.$sets = sets as Assignment[]
    return this
  }

  /**
   * 查询条件
   * @param condition
   */
  where(condition) {
    assert(!this.$where, 'where clause is declared')
    condition = ensureCondition(condition)
    this.$where = condition
    return this
  }
}

interface DeleteOptions {
  table?: UnsureIdentity
  sets?: object | Assignment[]
  joins?: Join[]
  where?: Conditions
}

export class Delete extends AST {
  $table: Identity
  $joins: Join[]
  $where: Conditions

  constructor(options?: DeleteOptions) {
    super(SqlSymbol.DELETE)
    if (options?.table) this.from(options.table)
    if (options?.joins) this.$joins = options.joins
    if (options?.where) this.where(options.where)
  }

  from(table: UnsureIdentity) {
    assert(!this.$table, 'table 已经声明')
    this.$table = ensureIdentity(table)
  }

  /**
   * 内联接
   * @param table
   * @param on
   * @param left
   * @memberof Select
   */
  join(table, on, left = false) {
    assert(this.$table, 'join must after from clause')
    if (!this.$joins) {
      this.$joins = []
    }
    this.$joins.push(
      new Join(table, on, left)
    )
    return this
  }

  leftJoin(table, on) {
    return this.join(table, on, true)
  }

  where(condition) {
    this.$where = ensureCondition(condition)
    return this
  }
}

/**
 * 存储过程执行
 */
export class Execute extends Statement {
  $proc: Identity
  $params: Expressions[] | Parameter[]
  constructor(proc: UnsureIdentity, ...params: UnsureExpressions[])
  constructor(proc: UnsureIdentity, ...params: Parameter[])
  constructor(proc: UnsureIdentity, ...params: UnsureExpressions[] | Parameter[]) {
    super(SqlSymbol.EXECUTE)
    this.$proc = ensureIdentity(proc)
    if (params.length === 0) {
      this.$params = []
    }

    if (!(params[0] instanceof Parameter)) {
      this.$params = (params as UnsureExpressions[]).map(expr => ensureConstant(expr))
    }

    this.$params = params as Parameter[]
  }
}

/**
 * 赋值表达式
 */
export class Assignment extends AST {
  $left: Expression
  $right: Expressions

  constructor(left: Expression, right: Expressions) {
    super(SqlSymbol.ASSIGNMENT)
    assert(left.lvalue, 'Argument left not lvalue')
    this.$left = left
    this.$right = ensureConstant(right)
  }
}

// class Declare extends AST {
//   constructor(name, dataType) {
//     super($declare)
//     this.$name = name
//     this.$dataType = dataType
//   }
// }

export class Parameter extends AST {
  $name: Identity
  $value: Expressions
  $direction: ParameterDirection

  constructor(name: UnsureIdentity, value: UnsureExpressions, direction: ParameterDirection = ParameterDirection.INPUT) {
    super(SqlSymbol.PARAMETER)
    this.$name = ensureIdentity(name)
    this.$value = ensureConstant(value)
    this.$direction = direction
  }
}

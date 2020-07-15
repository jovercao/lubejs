/**
 * lodash
 */
import * as _ from 'lodash'

import {
  assert,
  ensureConstant,
  ensureCondition,
  ensureIdentifier,
  makeProxiedIdentifier,
  ensureGroupValues,
  isJsConstant
  // assertType,
  // assertValue
} from './util'

import {
  CALCULATE_OPERATOR,
  PARAMETER_DIRECTION,
  SQL_SYMBOLE,
  COMPARE_OPERATOR,
  SORT_DIRECTION,
  LOGIC_OPERATOR,
  INSERT_MAXIMUM_ROWS
} from './constants'

// **********************************类型声明******************************************

/**
 * JS常量类型
 */
export type JsConstant = string | Date | boolean | null | number | Buffer | bigint;

/**
 * 未经确认的表达式
 */
export type UnsureExpression = Expression | JsConstant

/**
 * 简化后的whereObject查询条件
 */
export interface WhereObject {
  [field: string]: Expression | JsConstant | JsConstant[]
}

export type UnsureCondition = Condition | WhereObject

/**
 * SELECT查询表达式
 */
export type SelectExpression = Select | Bracket<Select> | Bracket<SelectExpression>

/**
 * 组数据
 */
export type UnsureGroupValues = UnsureExpression[] | List

export type UnsureIdentifier = Identifier | string

export type ProxiedIdentifier = Identifier & {
  [field: string]: Identifier
}

/**
 * AST 基类
 */
export abstract class AST {
  constructor(type: SQL_SYMBOLE) {
    this.type = type
  }

  readonly type: SQL_SYMBOLE

  static bracket<T extends AST>(context: T) {
    return new Bracket(context)
  }
}

// export interface IExpression {
//   /**
//    * 加法运算
//    */
//   add(expr: UnsureExpressions): Expression

//   /**
//    * 减法运算
//    */
//   sub(expr: UnsureExpressions): Expression

//   /**
//    * 乘法运算
//    * @param expr 要与当前表达式相乘的表达式
//    */
//   mul(expr: UnsureExpressions): Expression

//   /**
//    * 除法运算
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   div(expr: UnsureExpressions): Expression

//   /**
//    * 算术运算 %
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   mod(expr: UnsureExpressions): Expression


//   and(expr: UnsureExpressions): Expression

//   or(expr: UnsureExpressions): Expression

//   not(expr: UnsureExpressions): Expression
//   /**
//    * 位运算 ^
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   xor(expr: UnsureExpressions): Expression

//   /**
//    * 位运算 <<
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shl(expr: UnsureExpressions): Expression

//   /**
//    * 位运算 >>
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shr(expr: UnsureExpressions): Expression

//   /**
//    * 比较是否相等 =
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   eq(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否不等于 <>
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   neq(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否小于 <
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lt(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否小于等于 <=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lte(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否大于 >
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gt(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否小于等于 >=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gte(expr: UnsureExpressions): Condition

//   /**
//    * 比较是相像 LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   like(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否不想像 NOT LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notLike(expr: UnsureExpressions): Condition

//   /**
//    * 比较是否不包含于 IN
//    * @param values 要与当前表达式相比较的表达式数组
//    * @returns 返回对比条件表达式
//    */
//   in(...values: UnsureExpressions[]): Condition

//   /**
//    * 比较是否不包含于 NOT IN
//    * @param values 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notIn(...values: UnsureExpressions[]): Condition

//   /**
//    * 比较是否为空 IS NULL
//    * @returns 返回对比条件表达式
//    */
//   isNull(): Condition

//   /**
//    * 比较是否为空 IS NOT NULL
//    * @returns 返回对比条件表达式
//    */
//   isNotNull(): Condition

//   /**
//    * isNotNull 的简称别名
//    * @returns 返回对比条件表达式
//    */
//   notNull(): Condition

//   /**
//    * 正序
//    * @returns 返回对比条件表达式
//    */
//   asc(): SortInfo

//   /**
//    * 倒序
//    * @returns 返回对比条件表达式
//    */
//   desc(): SortInfo

//   /**
//    * 为当前表达式添加别名
//    */
//   as(alias: string): Identifier
// }

// const ExpressionPrototype: IExpression = {

// }

/**
 * 表达式基类，抽象类
 */
export abstract class Expression extends AST {

  /**
   * 加法运算
   */
  add(expr: UnsureExpression) {
    return Expression.add(this, expr)
  }

  /**
   * 减法运算
   */
  sub(expr: UnsureExpression) {
    return Expression.sub(this, expr)
  }

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: UnsureExpression) {
    return Expression.mul(this, expr)
  }

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: UnsureExpression) {
    return Expression.div(this, expr)
  }

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: UnsureExpression) {
    return Expression.mod(this, expr)
  }

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: UnsureExpression) {
    return Expression.and(this, expr)
  }

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: UnsureExpression) {
    return Expression.or(this, expr)
  }

  /**
   * 位运算 ~
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not(expr: UnsureExpression) {
    return Expression.not(this, expr)
  }

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: UnsureExpression) {
    return Expression.xor(this, expr)
  }

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: UnsureExpression) {
    return Expression.shl(this, expr)
  }

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: UnsureExpression) {
    return Expression.shr(this, expr)
  }

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: UnsureExpression) {
    return Condition.eq(this, expr)
  }

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: UnsureExpression) {
    return Condition.neq(this, expr)
  }

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: UnsureExpression) {
    return Condition.lt(this, expr)
  }

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: UnsureExpression) {
    return Condition.lte(this, expr)
  }

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: UnsureExpression) {
    return Condition.gt(this, expr)
  }

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: UnsureExpression) {
    return Condition.gte(this, expr)
  }

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: UnsureExpression) {
    return Condition.like(this, expr)
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: UnsureExpression) {
    return Condition.notLike(this, expr)
  }

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(...values: UnsureExpression[]) {
    return Condition.in(this, values)
  }

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(...values: UnsureExpression[]) {
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
    return new SortInfo(this, SORT_DIRECTION.ASC)
  }

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc(): SortInfo {
    return new SortInfo(this, SORT_DIRECTION.DESC)
  }

  /**
   * 为当前表达式添加别名
   */
  as(alias: string): ProxiedIdentifier {
    const identifier = new Alias(this, alias)
    return makeProxiedIdentifier(identifier)
  }

  /**
   * 获取当前表达式是否为左值
   * @type {boolean}
   */
  abstract get lvalue(): boolean

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static neg(expr: UnsureExpression) {
    return new UnaryCalculate(CALCULATE_OPERATOR.NEG, expr)
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static add(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.ADD, left, right)
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.SUB, left, right)
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.MUL, left, right)
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.DIV, left, right)
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.MOD, left, right)
  }

  /**
   * 位算术运算 &
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static and(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.BITAND, left, right)
  }

  /**
   * 位算术运算 |
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static or(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.BITOR, left, right)
  }

  /**
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.BITXOR, left, right)
  }

  /**
   * 位算术运算 ~
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.BITNOT, left, right)
  }

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.SHL, left, right)
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr(left: UnsureExpression, right: UnsureExpression) {
    return new BinaryCalculate(CALCULATE_OPERATOR.SHR, left, right)
  }

  /**
   * 常量
   * @param value 常量值
   */
  static constant(value: JsConstant) {
    return new Constant(value)
  }

  /**
   * 常量，constant 的别名
   * @param value 常量值
   */
  static const(value: JsConstant) {
    return Expression.constant(value)
  }

  /**
   * 变量
   * @param name 变量名称，不需要带前缀
   */
  static variant(name: string) {
    return new Variant(name)
  }

  /**
   * 变量，variant的别名
   * @param name 变量名，不需要带前缀
   */
  static var(name: string) {
    return Expression.variant(name)
  }

  static alias(expr: Expression, name: string) {
    return new Alias(expr, name)
  }

  /**
   * 任意字段 *
   * @param parent parent identifier
   */
  static any(parent?: UnsureIdentifier) {
    return Identifier.any(parent)
  }

  /**
   * 标识符
   */
  static identifier(...names: string[]): Identifier {
    assert(names.length > 0, 'must have one or more names')
    assert(names.length < 6, 'nodes deepth max 6 level')
    let identify: Identifier
    names.forEach(name => {
      if (!identify) {
        identify = Identifier.normal(name)
      } else {
        identify = identify.dot(name)
      }
    })
    return identify
  }

  /**
   * 代理化的identifier，可以自动接受字段名
   * @param name
   */
  static proxiedIdentifier(name: UnsureIdentifier) {
    return makeProxiedIdentifier(ensureIdentifier(name))
  }

  /**
   * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
   * @param names
   */
  static table(...names: string[]) {
    return Expression.proxiedIdentifier(Expression.identifier(...names))
  }

  /**
   * 字段，实为 identifier(...names) 别名
   * @param names
   */
  static field(...names: string[]) {
    return Expression.identifier(...names)
  }

  /**
   * 调用表达式
   * @param func 函数
   * @param params 参数
   */
  static invoke(func: UnsureIdentifier, params: (Expression | JsConstant)[]) {
    return new Invoke(func, params)
  }
}

export interface ICondition {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: Condition): Condition
  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup(condition: Condition): Condition

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Condition): Condition

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup(condition: Condition): Condition
}

const ConditionPrototype: ICondition = {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: Condition) {
    condition = ensureCondition(condition)
    return new BinaryLogic(LOGIC_OPERATOR.AND, this, condition)
  },

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup(condition: Condition) {
    condition = ensureCondition(condition)
    return new BinaryLogic(LOGIC_OPERATOR.AND, this, Condition.quoted(condition))
  },

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Condition) {
    condition = ensureCondition(condition)
    return new BinaryLogic(LOGIC_OPERATOR.OR, this, condition)
  },


  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  orGroup(condition: Condition) {
    condition = ensureCondition(condition)
    return new BinaryLogic(LOGIC_OPERATOR.OR, this, Condition.quoted(condition))
  }
}

/**
 * 查询条件
 */
export abstract class Condition extends AST implements ICondition {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and: (condition: Condition) => Condition

  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup: (condition: Condition) => Condition

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or: (condition: Condition) => Condition

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup: (condition: Condition) => Condition

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(...conditions: Condition[]) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new BinaryLogic(LOGIC_OPERATOR.AND, previous, current)
    })
  }

  /**
   * 将多个查询条件通过 OR 合并成一个
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static or(...conditions: Condition[]) {
    assert(_.isArray(conditions) && conditions.length > 1, 'Conditions must type of Array & have two or more elements.')
    return conditions.reduce((previous, current, index) => {
      current = ensureCondition(current)
      if (!previous) return current
      return new BinaryLogic(LOGIC_OPERATOR.OR, previous, current)
    })
  }

  /**
   * Not 逻辑运算
   * @param condition
   */
  static not(condition: Condition) {
    condition = ensureCondition(condition)
    return new UnaryLogic(LOGIC_OPERATOR.NOT, condition)
  }



  /**
   * 判断是否存在
   * @param select 查询语句
   */
  static exists(select: SelectExpression) {
    return new ExistsCompare(AST.bracket(select))
  }

  /**
   * 比较运算
   * @private
   * @param left 左值
   * @param right 右值
   * @param operator 运算符
   * @returns 返回比较运算对比条件
   */
  static compare(left: UnsureExpression, right: UnsureExpression | UnsureGroupValues, operator: COMPARE_OPERATOR = COMPARE_OPERATOR.EQ) {
    return new BinaryCompare(operator, left, right)
  }

  /**
   * 比较运算 =
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static eq(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.EQ)
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.NEQ)
  }

  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lt(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.LT)
  }

  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.LTE)
  }

  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.GT)
  }

  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.GTE)
  }

  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static like(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.LIKE)
  }

  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static notLike(left: UnsureExpression, right: UnsureExpression) {
    return Condition.compare(left, right, COMPARE_OPERATOR.NOT_LIKE)
  }

  /**
   * 比较运算 IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static in(left: UnsureExpression, values: UnsureGroupValues) {
    return Condition.compare(left, ensureGroupValues(values), COMPARE_OPERATOR.IN)
  }

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn(left: UnsureExpression, values: UnsureGroupValues) {
    return Condition.compare(left, ensureGroupValues(values), COMPARE_OPERATOR.NOT_IN)
  }

  /**
   * 比较运算 IS NULL
   * @returns 返回比较运算符
   * @param expr 表达式
   */
  static isNull(expr: UnsureExpression) {
    return new IsNullCondition(expr)
  }

  /**
   * 比较运算 IS NOT NULL
   * @param expr 表达式
   * @returns 返回比较运算符
   */
  static isNotNull(expr: UnsureExpression) {
    return new IsNotNullCondition(expr)
  }

  /**
   * 括号条件
   * @param condition 查询条件
   */
  static quoted(condition: Condition) {
    return new QuotedCondition(condition)
  }
}

Object.assign(Condition.prototype, ConditionPrototype)

/**
 * 二元逻辑查询条件条件
 */
export class BinaryLogic extends Condition implements IBinary {
  operator: LOGIC_OPERATOR
  left: Condition
  right: Condition
  /**
   * 创建二元逻辑查询条件实例
   */
  constructor(operator: LOGIC_OPERATOR, left: UnsureCondition, right: UnsureCondition) {
    super(SQL_SYMBOLE.BINARY_LOGIC)
    this.operator = operator
    /**
     * 左查询条件
     */
    this.left = ensureCondition(left)
    /**
     * 右查询条件
     */
    this.right = ensureCondition(right)
  }
}

/**
 * 一元逻辑查询条件
 */
export class UnaryLogic extends Condition implements IUnary {
  operator: LOGIC_OPERATOR
  next: Condition
  /**
   * 创建一元逻辑查询条件实例
   * @param operator
   * @param next
   */
  constructor(operator: LOGIC_OPERATOR, next: UnsureCondition) {
    super(SQL_SYMBOLE.UNARY_LOGIC)
    this.operator = operator
    this.next = ensureCondition(next)
  }
}

/**
 * 二元比较条件
 */
export class BinaryCompare extends Condition {
  left: Expression
  right: Expression | List
  operator: COMPARE_OPERATOR
  /**
   * 构造函数
   */
  constructor(operator: COMPARE_OPERATOR, left: UnsureExpression, right: UnsureExpression | UnsureGroupValues) {
    super(SQL_SYMBOLE.BINARY_COMPARE)
    this.operator = operator
    this.left = ensureConstant(left)
    if (_.isArray(right) || right instanceof List) {
      this.right = ensureGroupValues(right)
    } else {
      this.right = ensureConstant(right)
    }
  }
}

/**
 * 一元比较条件
 */
export class UnaryCompare extends Condition implements IUnary {
  next: Expression
  operator: COMPARE_OPERATOR
  /**
   * 一元比较运算符
   * @param operator 运算符
   * @param expr 查询条件
   */
  constructor(operator: COMPARE_OPERATOR, expr: UnsureExpression) {
    super(SQL_SYMBOLE.UNARY_COMPARE)
    this.operator = operator
    assert(expr, 'next must not null')
    this.next = ensureConstant(expr)
  }
}


/**
 * 一元比较条件
 */
export class ExistsCompare extends Condition {
  expr: SelectExpression
  /**
   * EXISTS子句
   * @param expr 查询条件
   */
  constructor(expr: SelectExpression) {
    super(SQL_SYMBOLE.EXISTS)
    this.expr = expr
  }
}

/**
 * IS NULL 运算
 */
class IsNullCondition extends UnaryCompare {
  /**
   * @param next 表达式
   */
  constructor(next: UnsureExpression) {
    super(COMPARE_OPERATOR.IS_NULL, next)
  }
}

/**
 * 是否为空值条件
 */
class IsNotNullCondition extends UnaryCompare {
  /**
   * 是否空值
   * @param next 表达式
   */
  constructor(next: UnsureExpression) {
    super(COMPARE_OPERATOR.IS_NOT_NULL, next)
  }
}

/**
 * 联接查询
 */
export class Join extends AST {
  readonly type: SQL_SYMBOLE
  left: boolean
  table: Identifier
  on: Condition

  /**
   * 创建一个表关联
   * @param table
   * @param on 关联条件
   * @param left 是否左联接
   */
  constructor(table: UnsureIdentifier, on: Condition, left: boolean = false) {
    super(SQL_SYMBOLE.JOIN)

    /**
     * 关联表
    * @type {Table}
    */
    this.table = ensureIdentifier(table)
    /**
     * 关联条件
    * @type {Condition}
    */
    this.on = ensureCondition(on)

    /**
     * 是否左联接
     * @type {boolean}
     */
    this.left = left
  }
}

export class Raw extends AST {
  sql: string
  constructor(sql: string) {
    super(SQL_SYMBOLE.RAW)
    this.sql = sql
  }
}

/**
 * 标识符，可以多级，如表名等
 */
export class Identifier extends Expression {

  // [name: string]: Identifier

  public readonly name: string
  public readonly parent?: Identifier

  /**
   * 标识符
   */
  protected constructor(name: string, parent?: UnsureIdentifier, type: SQL_SYMBOLE = SQL_SYMBOLE.IDENTIFIER) {
    super(type)
    this.name = name
    if (parent) {
      this.parent = ensureIdentifier(parent)
    } else {
      this.parent = null
    }
  }

  get lvalue() {
    return true
  }

  /**
   * 访问下一节点
   * @param name
   */
  dot(name: string) {
    return makeProxiedIdentifier(new Identifier(name, this))
  }

  any() {
    return Identifier.any(this)
  }

  /**
   * 执行一个函数
   * @param params
   */
  invoke(...params: (UnsureExpression)[]) {
    return new Invoke(this, params)
  }

  /**
   * 常规标识符
   */
  static normal(name: string) {
    return new Identifier(name)
  }

  /**
   * 内建标识符
   */
  static buildIn(name: string) {
    return new Identifier(name, null, SQL_SYMBOLE.BUILDIN_IDENTIFIER)
  }

  /**
   * 内建标识符
   */
  static any(parent?: UnsureIdentifier) {
    return new Identifier('*', parent, SQL_SYMBOLE.BUILDIN_IDENTIFIER)
  }
}

export class Variant extends Expression {
  name: string

  constructor(name: string) {
    super(SQL_SYMBOLE.VARAINT)
    this.name = name
  }

  get lvalue() {
    return true
  }
}

/**
 * 别名表达式
 */
export class Alias extends Identifier {
  /**
   * 表达式
   */
  readonly expr: Expression

  /**
   * 别名构造函数
   * @param expr 表达式或表名
   * @param name 别名
   */
  constructor(expr: UnsureExpression, name: string) {
    super(name, null, SQL_SYMBOLE.ALIAS)
    assert(_.isString(name), 'The alias must type of string')
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
    if (expr instanceof Alias) {
      throw new Error('Aliases do not allow nesting')
    }
    this.expr = ensureConstant(expr)
  }
}

/**
 * 函数调用表达式
 */
export class Invoke extends Expression {

  get lvalue() {
    return false
  }

  func: Identifier

  args: List

  /**
   * 函数调用
   */
  constructor(func: UnsureIdentifier, args?: UnsureExpression[]) {
    super(SQL_SYMBOLE.INVOKE)
    this.func = ensureIdentifier(func)
    this.args = List.invokeArgs(...args)
  }
}

/**
 * SQL 语句
 */
export abstract class Statement extends AST {

  /**
   * 插入至表,into的别名
   * @param table
   * @param fields
   */
  static insert(table: UnsureIdentifier, fields?: UnsureIdentifier[]) {
    return new Insert(table, fields)
  }

  /**
   * 更新一个表格
   * @param table
   */
  static update(table: UnsureIdentifier) {
    return new Update(table).from(table)
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete(table: UnsureIdentifier) {
    return new Delete(table)
  }

  /**
   * 选择列
   */
  static select(columns: KeyValueObject): Select
  static select(...columns: UnsureExpression[]): Select
  static select(...args: any[]) {
    return new Select(...args)
  }

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  static execute(proc: UnsureIdentifier, params?: UnsureExpression[]): Execute
  static execute(proc: UnsureIdentifier, params?: Parameter[]): Execute
  static execute(proc: UnsureIdentifier, params?: UnsureExpression[] | Parameter[]): Execute {
    return new Execute(proc, params)
  }

  /**
   * 执行一个存储过程，execute的别名
   * @param proc 存储过程
   * @param params 参数
   */
  static exec(proc: UnsureIdentifier, params: UnsureExpression[]): Execute
  static exec(proc: UnsureIdentifier, params: Parameter[]): Execute
  static exec(proc: UnsureIdentifier, params: UnsureExpression[] | Parameter[]): Execute {
    return new Execute(proc, params)
  }

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static assign(left: Expression, right: UnsureExpression) {
    return new Assignment(left, right)
  }

  /**
   * 变量声明
   * @param declares 变量列表
   */
  static declare(...declares: VariantDeclare[]): Declare {
    return new Declare(...declares)
  }

  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when(expr: UnsureExpression, value?: UnsureExpression) {
    return new When(expr, value)
  }

  static case(expr?: UnsureExpression) {
    return new Case(expr)
  }
}

/**
 * When语句
 */
export class When extends AST {
  expr: Expression | Condition
  value: Expression

  constructor(expr: UnsureExpression | UnsureCondition, then: UnsureExpression) {
    super(SQL_SYMBOLE.WHEN)
    if (expr instanceof Expression || expr instanceof Condition) {
      this.expr = expr
    } if (isJsConstant(expr)) {
      this.expr = ensureConstant(expr as JsConstant)
    } else {
      this.expr = ensureCondition(expr as WhereObject)
    }
    this.value = ensureConstant(then)
  }
}

/**
 * CASE表达式
 */
export class Case extends Expression {

  get lvalue() {
    return false
  }

  expr: Expression | Condition
  whens: When[]
  defaults?: Expression

  /**
   *
   * @param expr
   */
  constructor(expr?: UnsureExpression) {
    super(SQL_SYMBOLE.CASE)
    if (expr !== undefined) {
      this.expr = ensureConstant(expr)
    }
    /**
     * @type {When[]}
     */
    this.whens = []
  }

  /**
   * ELSE语句
   * @param defaults
   */
  else(defaults: UnsureExpression): this {
    this.defaults = ensureConstant(defaults)
    return this
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(expr: UnsureExpression | UnsureCondition, then: UnsureExpression): this {
    this.whens.push(
      new When(expr, then)
    )
    return this
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
  value: JsConstant

  constructor(value: JsConstant) {
    super(SQL_SYMBOLE.CONSTANT)
    this.value = value
  }
}

/**
 * 值列表（不含括号）
 */
export class List extends AST {
  items: Expression[]
  private constructor(symbol: SQL_SYMBOLE, ...values: UnsureExpression[]) {
    super(symbol)
    this.items = values.map(value => ensureConstant(value))
  }

  static values(...values: UnsureExpression[]): List {
    return new List(SQL_SYMBOLE.VALUE_LIST, ...values)
  }

  static columns(...exprs: UnsureExpression[]): List {
    return new List(SQL_SYMBOLE.COLUMN_LIST, ...exprs)
  }

  static invokeArgs(...exprs: UnsureExpression[]): List {
    return new List(SQL_SYMBOLE.INVOKE_ARGUMENT_LIST, ...exprs)
  }

  static execArgs(...exprs: UnsureExpression[]): List {
    return new List(SQL_SYMBOLE.EXECUTE_ARGUMENT_LIST, ...exprs)
  }
}

/**
 * 括号引用
 */
export class Bracket<T extends AST> extends Expression {
  get lvalue() {
    return false
  }

  /**
   * 表达式
   */
  context: T

  constructor(context: T) {
    super(SQL_SYMBOLE.BRACKET_EXPRESSION)
    this.context = context
  }
}

// export class BracketExpression extends Bracket<Expressions | List | Select> implements IExpression {

//   /**
//    * 加法运算
//    */
//   add: (expr: UnsureExpressions) => Expression

//   /**
//    * 减法运算
//    */
//   sub: (expr: UnsureExpressions) => Expression

//   /**
//    * 乘法运算
//    * @param expr 要与当前表达式相乘的表达式
//    */
//   mul: (expr: UnsureExpressions) => Expression

//   /**
//    * 除法运算
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   div: (expr: UnsureExpressions) => Expression

//   /**
//    * 算术运算 %
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   mod: (expr: UnsureExpressions) => Expression


//   and: (expr: UnsureExpressions) => Expression

//   or: (expr: UnsureExpressions) => Expression

//   not: (expr: UnsureExpressions) => Expression
//   /**
//    * 位运算 ^
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   xor: (expr: UnsureExpressions) => Expression

//   /**
//    * 位运算 <<
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shl: (expr: UnsureExpressions) => Expression

//   /**
//    * 位运算 >>
//    * @param expr 要与当前表达式相除的表达式
//    * @returns 返回运算后的表达式
//    */
//   shr: (expr: UnsureExpressions) => Expression

//   /**
//    * 比较是否相等 =
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   eq: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否不等于 <>
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   neq: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否小于 <
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lt: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否小于等于 <=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   lte: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否大于 >
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gt: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否小于等于 >=
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   gte: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是相像 LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   like: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否不想像 NOT LIKE
//    * @param expr 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notLike: (expr: UnsureExpressions) => Condition

//   /**
//    * 比较是否不包含于 IN
//    * @param values 要与当前表达式相比较的表达式数组
//    * @returns 返回对比条件表达式
//    */
//   in: (...values: UnsureExpressions[]) => Condition

//   /**
//    * 比较是否不包含于 NOT IN
//    * @param values 要与当前表达式相比较的表达式
//    * @returns 返回对比条件表达式
//    */
//   notIn: (...values: UnsureExpressions[]) => Condition

//   /**
//    * 比较是否为空 IS NULL
//    * @returns 返回对比条件表达式
//    */
//   isNull: () => Condition

//   /**
//    * 比较是否为空 IS NOT NULL
//    * @returns 返回对比条件表达式
//    */
//   isNotNull: () => Condition

//   /**
//    * isNotNull 的简称别名
//    * @returns 返回对比条件表达式
//    */
//   notNull: () => Condition

//   /**
//    * 正序
//    * @returns 返回对比条件表达式
//    */
//   asc: () => SortInfo

//   /**
//    * 倒序
//    * @returns 返回对比条件表达式
//    */
//   desc: () => SortInfo

//   /**
//    * 为当前表达式添加别名
//    */
//   as: (alias: string) => Alias

// }

export class QuotedCondition extends Condition implements ICondition {
  context: Condition

  constructor(conditions: UnsureCondition) {
    super(SQL_SYMBOLE.QUOTED_CONDITION)
    this.context = ensureCondition(conditions)
  }

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and: (condition: UnsureCondition) => Condition

  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup: (condition: UnsureCondition) => Condition

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or: (condition: UnsureCondition) => Condition

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup: (condition: UnsureCondition) => Condition

  /**
   * 返回括号表达式
   */
  quoted: () => Bracket<Condition>
}

Object.assign(QuotedCondition.prototype, ConditionPrototype)

export interface IBinary extends AST {
  operator: String
  left: AST
  right: AST
}

export interface IUnary extends AST {
  operator: String
  next: AST
}

/**
 * 二元运算表达式
 */
export class BinaryCalculate extends Expression implements IBinary {

  get lvalue() {
    return false
  }

  operator: CALCULATE_OPERATOR
  left: Expression
  right: Expression

  /**
   * 名称
   * @param operator 运算符
   * @param left 左值
   * @param right 右值
   */
  constructor(operator: CALCULATE_OPERATOR, left: UnsureExpression, right: UnsureExpression) {
    super(SQL_SYMBOLE.BINARY_CALCULATE)
    assert(left, 'The argument left must not null')
    assert(right, 'The arguemnt right must not null')
    this.operator = operator

    this.left = ensureConstant(left)
    this.right = ensureConstant(right)
  }
}

/**
 * - 运算符
 */
export class UnaryCalculate extends Expression implements IUnary {

  readonly operator: CALCULATE_OPERATOR.NEG
  readonly next: Expression
  readonly type: SQL_SYMBOLE

  get lvalue() {
    return false
  }
  /**
   * 一元运算目前只支持负数运算符
   * @param expr
   */
  constructor(operator: CALCULATE_OPERATOR.NEG, expr: UnsureExpression) {
    super(SQL_SYMBOLE.UNARY_CALCULATE)
    this.operator = operator
    this.next = ensureConstant(expr)
  }
}

/**
 * 联接查询
 */
export class Union extends AST {
  select: SelectExpression
  all: boolean
  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select: SelectExpression, all: boolean = false) {
    super(SQL_SYMBOLE.UNION)
    this.select = select
    this.all = all
  }
}

// export interface SelectOptions {
//   from?: UnsureIdentifier[],
//   top?: number,
//   offset?: number,
//   limit?: number,
//   distinct?: boolean,
//   columns?: UnsureExpressions[],
//   joins?: Join[],
//   where?: Conditions,
//   orderBy?: (SortInfo | UnsureExpressions)[],
//   groupBy?: UnsureExpressions[]
// }

export interface SortObject {
  [key: string]: SORT_DIRECTION
}

abstract class Fromable extends Statement {
  tables?: Identifier[]
  joins?: Join[]
  filters?: Condition

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables: UnsureIdentifier[]): this {
    // assert(!this.$from, 'from已经声明')
    this.tables = tables.map(table => ensureIdentifier(table))
    return this
  }

  /**
   * 表联接
   * @param table
   * @param on
   * @param left
   * @memberof Select
   */
  join(table: UnsureIdentifier, on: Condition, left = false) {
    assert(this.tables, 'join must after from clause')
    if (!this.joins) {
      this.joins = []
    }
    this.joins.push(
      new Join(table, on, left)
    )
    return this
  }

  /**
   * 左联接
   * @param table
   * @param on
   */
  leftJoin(table: UnsureIdentifier, on: Condition) {
    return this.join(table, on, true)
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition: UnsureCondition) {
    assert(!this.filters, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = ensureCondition(condition)
    }
    // assert(condition instanceof Condition, 'Then argument condition must type of Condition')
    this.filters = condition as Condition
    return this
  }
}

export class SortInfo extends AST {
  expr: Expression
  direction?: SORT_DIRECTION
  constructor(expr: UnsureExpression, direction?: SORT_DIRECTION) {
    super(SQL_SYMBOLE.SORT)
    this.expr = ensureConstant(expr)
    this.direction = direction
  }
}

/**
 * SELECT查询
 */
export class Select extends Fromable {
  tops?: number
  offsets?: number
  limits?: number
  isDistinct?: boolean
  columns: List
  sorts?: SortInfo[]
  groups?: Expression[]
  havings?: Condition
  unions?: Union

  constructor(columns?: ValuesObject)
  constructor(...columns: UnsureExpression[])
  constructor(...columns: (ValuesObject | UnsureExpression)[]/*options?: SelectOptions*/) {
    super(SQL_SYMBOLE.SELECT)
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      const obj = columns[0]
      this.columns = List.columns(...Object.entries(obj).map(([alias, expr]) => new Alias(ensureConstant(expr), alias)))
      return
    }
    // 实例化
    this.columns = List.columns(...(columns as UnsureExpression[]).map(expr => ensureConstant(expr)))
    // if (options?.from) this.from(...options.from)
    // if (options?.joins) this.$joins = options.joins
    // if (options?.columns) this.columns(...options.columns)
    // if (options?.where) this.where(options.where)
    // if (options?.orderBy) this.orderBy(...options.orderBy)
    // if (options?.groupBy) this.groupBy(...options.groupBy)
    // if (options?.distinct === true) this.distinct()
    // if (options?.top !== undefined) this.top(options.top)
    // if (options?.offset !== undefined) this.offset(options.offset)
    // if (options?.limit !== undefined) this.offset(options.limit)
  }

  /**
   * 去除重复的
   */
  distinct() {
    this.isDistinct = true
    return this
  }

  /**
   * TOP
   * @param rows 行数
   */
  top(rows: number) {
    assert(_.isUndefined(this.tops), 'top is declared')
    this.tops = rows
    return this
  }

  /**
   * order by 排序
   * @param sorts 排序信息
   */
  orderBy(sorts: SortObject): this
  orderBy(...sorts: (SortInfo | UnsureExpression)[]): this
  orderBy(...sorts: (SortObject | SortInfo | UnsureExpression)[]): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(sorts.length > 0, 'must have one or more order basis')
    // 如果传入的是对象类型
    if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
      const obj = sorts[0]
      this.sorts = Object.entries(obj).map(([expr, direction]) => (new SortInfo(expr, direction)))
      return this
    }
    sorts = sorts as (UnsureExpression | SortInfo)[]
    this.sorts = sorts.map(
      expr => expr instanceof SortInfo ? expr : new SortInfo(expr as UnsureExpression)
    )
    return this
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: UnsureExpression[]) {
    this.groups = groups.map(expr => ensureConstant(expr))
    return this
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition: UnsureCondition) {
    assert(!this.havings, 'having is declared')
    assert(this.groups, 'Syntax error, group by is not declared.')
    if (!(condition instanceof Condition)) {
      condition = ensureCondition(condition)
    }
    this.havings = condition
    return this
  }

  /**
   * 偏移数
   * @param rows
   */
  offset(rows: number) {
    this.offsets = rows
    return this
  }

  /**
   * 限定数
   * @param rows
   */
  limit(rows: number) {
    assert(_.isNumber(rows), 'The argument rows must type of Number')
    this.limits = rows
    return this
  }

  /**
   * 合并查询
   */
  union(select: SelectExpression, all = false) {
    this.unions = new Union(select, all)
  }

  unionAll(select: SelectExpression) {
    return this.union(select, true)
  }

  /**
   * 将本SELECT返回表达式
   * @returns 返回一个加()后的SELECT语句
   */
  quoted() {
    return new Bracket(this)
  }

  /**
   * 将本次查询，转换为Table行集
   * @param alias
   */
  as(alias: string) {
    return makeProxiedIdentifier(new Alias(this.quoted(), alias))
  }
}

/**
 * Insert 语句
 */
export class Insert extends Statement {

  table: Identifier
  fields?: Identifier[]
  rows: List[] | Select

  /**
   * 构造函数
   */
  constructor(table: UnsureIdentifier, fields?: UnsureIdentifier[]) {
    super(SQL_SYMBOLE.INSERT)
    assert(!this.table, 'The into clause is declared')
    this.table = ensureIdentifier(table)
    if (fields) {
      this._fields(...fields)
    }
    return this
  }


  /**
   * 字段列表
   * @param  {string[]|Field[]} fields
   */
  private _fields(...fields: UnsureIdentifier[]) {
    assert(fields.length > 0, 'fields not allow empty.')
    /**
     * 字段列表
     */
    this.fields = fields.map(p => ensureIdentifier(p))
    return this
  }

  values(select: Select): this
  values(row: ValuesObject): this
  values(row: UnsureExpression[]): this
  values(rows: UnsureExpression[][]): this
  values(rows: ValuesObject[]): this
  values(...rows: UnsureExpression[][]): this
  values(...rows: ValuesObject[]): this
  values(...args: any[]): this {
    assert(!this.rows, 'values is declared')
    assert(args.length > 0, 'rows must more than one elements.')
    let items: ValuesObject[], rows: UnsureExpression[][]
    // 单个参数
    if (args.length === 1) {
      const values = args[0]
      // values(Select)
      if (values instanceof Select) {
        this.rows = args[0]
        return this
      }
      // values(UnsureExpression[] | ValuesObject[] | UnsureExpression[])
      if (_.isArray(values)) {

        // values(UnsureExpression[][])
        if (_.isArray(values[0])) {
          rows = args[0]
        }
        // values(UnsureExpression[])
        else if (isJsConstant(values[0]) || values[0] === undefined || values[0] instanceof Expression) {
          rows = [values]
        }
        // values(ValueObject[])
        else if (_.isObject(values[0])){
          items = values
        } else {
          throw new Error('invalid arguments！')
        }
      }
      // values(ValueObject)
      else if (_.isObject(values)) {
        items = args
      } else {
        throw new Error('invalid arguments！')
      }
    } else {
      if (_.isArray(args[0])) {
        // values(...UsureExpression[][])
        rows = args
      }
      // values(...ValueObject[])
      else if (_.isObject(args[0])) {
        items = args
      }
      // invalid
      else {
        throw new Error('invalid arguments！')
      }
    }

    if ((rows || items).length > INSERT_MAXIMUM_ROWS) {
      throw new Error('Insert statement values exceed the maximum rows.')
    }

    // values(rows: UnsureExpressions[][])
    if (rows) {
      this.rows = rows.map(row => List.values(...row))
      return this
    }

    // values(items: ValueObject[])
    if (!this.fields) {
      const existsFields: { [key: string]: boolean } = {}
      items.forEach(item => Object.keys(item).forEach(field => {
        if (!existsFields[field]) existsFields[field] = true
      }))
      this._fields(...Object.keys(existsFields))
    }

    this.rows = items.map(item => {
      const rowValues = this.fields.map(field => (item as ValuesObject)[field.name])
      return List.values(...rowValues)
    })
    return this
  }
}

// export interface UpdateOptions {
//   table?: UnsureIdentifier
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }

export interface KeyValueObject {
  [field: string]: UnsureExpression
}

export type ValuesObject = KeyValueObject
export type AssignObject = KeyValueObject

export interface ResultObject {
  [field: string]: JsConstant
}

export class Update extends Fromable {
  table: Identifier
  sets: Assignment[]

  constructor(table: UnsureIdentifier /*options?: UpdateOptions*/) {
    super(SQL_SYMBOLE.UPDATE)
    this.table = ensureIdentifier(table)
    // if (options?.table) this.from(options.table)
    // if (options?.sets) this.set(options.sets)
    // if (options?.where) this.where(options.where)
    // if (options?.joins) this.$joins = options.joins
  }

  /**
   * @param sets
   */
  set(sets: AssignObject): this
  set(...sets: Assignment[]): this
  set(...sets: AssignObject[] | Assignment[]): this {
    assert(!this.sets, 'set statement is declared')
    assert(sets.length > 0, 'sets must have more than 0 items')
    if (sets.length > 1 || sets[0] instanceof Assignment) {
      this.sets = sets as Assignment[]
      return this
    }

    const obj = sets[0]
    this.sets = Object.entries(obj).map(
      ([key, value]) => new Assignment(Identifier.normal(key), ensureConstant(value))
    )
    return this
  }
}

// export interface DeleteOptions {
//   table?: UnsureIdentifier
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }

export class Delete extends Fromable {
  table: Identifier

  constructor(table: UnsureIdentifier /*options?: DeleteOptions*/) {
    super(SQL_SYMBOLE.DELETE)
    this.table = ensureIdentifier(table)
    // if (options?.table) this.from(options.table)
    // if (options?.joins) this.$joins = options.joins
    // if (options?.where) this.where(options.where)
  }

}

/**
 * 存储过程执行
 */
export class Execute extends Statement {
  proc: Identifier
  args: List
  constructor(proc: UnsureIdentifier, args?: UnsureExpression[])
  constructor(proc: UnsureIdentifier, args?: Parameter[])
  constructor(proc: UnsureIdentifier, args?: UnsureExpression[] | Parameter[])
  constructor(proc: UnsureIdentifier, args?: UnsureExpression[] | Parameter[]) {
    super(SQL_SYMBOLE.EXECUTE)
    this.proc = ensureIdentifier(proc)
    if (!args || args.length === 0) {
      this.args
      return
    }

    this.args = List.invokeArgs(...args)
  }
}

/**
 * 赋值语句
 */
export class Assignment extends Statement {
  left: Expression
  right: Expression

  constructor(left: Expression, right: UnsureExpression) {
    super(SQL_SYMBOLE.ASSIGNMENT)
    assert(left.lvalue, 'Argument left not lvalue')
    this.left = left
    this.right = ensureConstant(right)
  }
}

class VariantDeclare extends AST {
  constructor(name: string, dataType: string) {
    super(SQL_SYMBOLE.VARAINT_DECLARE)
    this.name = name
    this.dataType = dataType
  }

  name: string
  dataType: string
}

/**
 * 声明语句，暂时只支持变量声明
 */
export class Declare extends Statement {
  declares: VariantDeclare[]

  constructor(...declares: VariantDeclare[]) {
    super(SQL_SYMBOLE.DECLARE)
    this.declares = declares
  }
}

type DbType = string
type JsType = Function

/**
 * 程序与数据库间传递值所使用的参数
 */
export class Parameter extends Expression {
  name?: string
  private _value?: JsConstant
  direction: PARAMETER_DIRECTION
  dbType?: DbType | JsType
  get lvalue() {
    return false
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = value
    // TODO: 自动设置数据类型
  }

  constructor(name: string, dbType: DbType | JsType, value: JsConstant, direction: PARAMETER_DIRECTION = PARAMETER_DIRECTION.INPUT) {
    super(SQL_SYMBOLE.PARAMETER)
    this.name = name
    this.value = value // ensureConstant(value)
    this.dbType = dbType
    this.direction = direction
  }

  /**
   * input 参数
   */
  static input(name: string, value: JsConstant) {
    return new Parameter(name, null, value, PARAMETER_DIRECTION.INPUT)
  }

  /**
   * output参数
   */
  static output(name: string, type: DbType | JsType, value?: JsConstant) {
    return new Parameter(name, type, value, PARAMETER_DIRECTION.OUTPUT)
  }
}

/**
 * SQL 文档
 */
export class Document extends AST {
  statements: Statement[]
  constructor(...statements: Statement[]) {
    super(SQL_SYMBOLE.DOCUMENT)
    this.statements = statements
  }
}

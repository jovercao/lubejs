/**
 * lodash
 */
import * as _ from 'lodash'

import {
  assert,
  ensureConstant,
  ensureCondition,
  ensureIdentity,
  makeProxyIdentity,
  ensureGroupValues
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
export type JsConstant = String | Date | Boolean | null | undefined | Number | Buffer;

/**
 * 带括号的查询条件
 */
export type BracketConditions = Bracket<Conditions>;

/**
 * 查询条件列表
 */
export type Conditions = Condition | Bracket<Condition | BracketConditions>

/**
 * 未经确认的表达式
 */
export type UnsureExpressions = Expressions | JsConstant

/**
 * 简化后的whereObject查询条件
 */
export interface WhereObject {
  [field: string]: JsConstant | JsConstant[]
}

export type UnsureConditions = Conditions | WhereObject

export type SelectExpression = Bracket<Select>

/**
 * SELECT查询表达式
 */
export type UnsureSelectExpressions = Select | Bracket<Select>

export type Expressions = BracketExpression | Expression | Bracket<AST>

export type GroupValues = Bracket<ValueList>
/**
 * 组数据
 */
export type UnsureGroupValues = UnsureExpressions[] | Bracket<ValueList> | ValueList

export type UnsureIdentity = Identifier | string


/**
 * AST 基类
 */
export abstract class AST {
  constructor(type: SqlSymbol) {
    this.type = type
  }

  readonly type: SqlSymbol

  static bracket<T extends AST>(context: T) {
    return new Bracket(context)
  }

  static list(...values: UnsureExpressions[]) {
    return AST.bracket(new ValueList(...values))
  }
}

export interface IExpression {
  /**
   * 加法运算
   */
  add(expr: UnsureExpressions): Expression

  /**
   * 减法运算
   */
  sub(expr: UnsureExpressions): Expression

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: UnsureExpressions): Expression

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: UnsureExpressions): Expression

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: UnsureExpressions): Expression


  and(expr: UnsureExpressions): Expression

  or(expr: UnsureExpressions): Expression

  not(expr: UnsureExpressions): Expression
  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: UnsureExpressions): Expression

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: UnsureExpressions): Expression

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: UnsureExpressions): Expression

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: UnsureExpressions): Condition

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: UnsureExpressions): Condition

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: UnsureExpressions): Condition

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: UnsureExpressions): Condition

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: UnsureExpressions): Condition

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: UnsureExpressions): Condition

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: UnsureExpressions): Condition

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: UnsureExpressions): Condition

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(...values: UnsureExpressions[]): Condition

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(...values: UnsureExpressions[]): Condition

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull(): Condition

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull(): Condition

  /**
   * isNotNull 的简称别名
   * @returns 返回对比条件表达式
   */
  notNull(): Condition

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc(): SortInfo

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc(): SortInfo

  /**
   * 为当前表达式添加别名
   */
  as(alias: string): Identifier
}

const ExpressionPrototype: IExpression = {

  /**
   * 加法运算
   */
  add(expr: UnsureExpressions) {
    return Expression.add(this, expr)
  },

  /**
   * 减法运算
   */
  sub(expr: UnsureExpressions) {
    return Expression.sub(this, expr)
  },

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: UnsureExpressions) {
    return Expression.mul(this, expr)
  },

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: UnsureExpressions) {
    return Expression.div(this, expr)
  },

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: UnsureExpressions) {
    return Expression.mod(this, expr)
  },

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: UnsureExpressions) {
    return Expression.and(this, expr)
  },

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: UnsureExpressions) {
    return Expression.or(this, expr)
  },

  /**
   * 位运算 ~
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not(expr: UnsureExpressions) {
    return Expression.not(this, expr)
  },

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: UnsureExpressions) {
    return Expression.xor(this, expr)
  },

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: UnsureExpressions) {
    return Expression.shl(this, expr)
  },

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: UnsureExpressions) {
    return Expression.shr(this, expr)
  },

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: UnsureExpressions) {
    return Condition.eq(this, expr)
  },

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: UnsureExpressions) {
    return Condition.neq(this, expr)
  },

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: UnsureExpressions) {
    return Condition.lt(this, expr)
  },

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: UnsureExpressions) {
    return Condition.lte(this, expr)
  },

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: UnsureExpressions) {
    return Condition.gt(this, expr)
  },

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: UnsureExpressions) {
    return Condition.gte(this, expr)
  },

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: UnsureExpressions) {
    return Condition.like(this, expr)
  },

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: UnsureExpressions) {
    return Condition.notLike(this, expr)
  },

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(...values: UnsureExpressions[]) {
    return Condition.in(this, values)
  },

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(...values: UnsureExpressions[]) {
    return Condition.notIn(this, values)
  },

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull() {
    return Condition.isNull(this)
  },

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull() {
    return Condition.isNotNull(this)
  },

  /**
   * isNotNull 的简称别名
   * @returns 返回对比条件表达式
   */
  notNull() {
    return this.isNotNull()
  },

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc(): SortInfo {
    return new SortInfo(this, SortDirection.ASC)
  },

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc(): SortInfo {
    return new SortInfo(this, SortDirection.DESC)
  },

  /**
   * 为当前表达式添加别名
   */
  as(alias: string): Identifier {
    const identifier = new Alias(this, alias)
    if (identifier instanceof Identifier) {
      return makeProxyIdentity(identifier)
    }
    return identifier
  }
}

/**
 * 表达式基类，抽象类
 */
export abstract class Expression extends AST implements IExpression {

  /**
   * 加法运算
   */
  add: (expr: UnsureExpressions) => Expression

  /**
   * 减法运算
   */
  sub: (expr: UnsureExpressions) => Expression

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul: (expr: UnsureExpressions) => Expression

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div: (expr: UnsureExpressions) => Expression

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and: (expr: UnsureExpressions) => Expression

  /**
 * 位运算 |
 * @param expr 要与当前表达式相除的表达式
 * @returns 返回运算后的表达式
 */
  or: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 ~
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  not: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr: (expr: UnsureExpressions) => Expression

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte: (expr: UnsureExpressions) => Condition

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in: (...values: UnsureExpressions[]) => Condition

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn: (...values: UnsureExpressions[]) => Condition

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull: () => Condition

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull: () => Condition

  /**
   * isNotNull 的简称别名
   * @returns 返回对比条件表达式
   */
  notNull: () => Condition

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc: () => SortInfo

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc: () => SortInfo

  /**
   * 为当前表达式添加别名
   */
  as: (alias: string) => Identifier

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
  static add(left, right) {
    return new BinaryExpression(ComputeOperator.ADD, left, right)
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub(left, right) {
    return new BinaryExpression(ComputeOperator.SUB, left, right)
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul(left, right) {
    return new BinaryExpression(ComputeOperator.MUL, left, right)
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div(left, right) {
    return new BinaryExpression(ComputeOperator.DIV, left, right)
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod(left, right) {
    return new BinaryExpression(ComputeOperator.MOD, left, right)
  }

  /**
   * 位算术运算 &
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static and(left, right) {
    return new BinaryExpression(ComputeOperator.BITAND, left, right)
  }

  /**
   * 位算术运算 |
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static or(left, right) {
    return new BinaryExpression(ComputeOperator.BITOR, left, right)
  }

  /**
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor(left, right) {
    return new BinaryExpression(ComputeOperator.BITXOR, left, right)
  }

  /**
   * 位算术运算 ~
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static not(left, right) {
    return new BinaryExpression(ComputeOperator.BITNOT, left, right)
  }

  /**
   * 位算术运算 <<
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl(left, right) {
    return new BinaryExpression(ComputeOperator.SHL, left, right)
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr(left, right) {
    return new BinaryExpression(ComputeOperator.SHR, left, right)
  }

  /**
   * CASE语句表达式
   * @param expr 表达式
   */
  static case(expr: UnsureExpressions) {
    return new Case(expr)
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

  static alias(expr: Expressions, name: string) {
    return new Alias(expr, name)
  }

  /**
   * 任意字段 *
   * @param parent parent identifier
   */
  static any(parent?: UnsureIdentity) {
    return Identifier.any(parent)
  }

  /**
   * 标识符
   */
  static identifier(...names: string[]): Identifier {
    assert(names.length > 0, 'must have one or more names')
    assert(names.length < 6, 'nodes deepth max 6 level')
    let identity: Identifier
    names.forEach(name => {
      if (!identity) {
        identity = Identifier.normal(name)
      } else {
        identity = identity.dot(name)
      }
    })
    return identity
  }

  /**
   * 代理化的identifier，可以自动接受字段名
   * @param name
   */
  static proxyIdentifier(name: UnsureIdentity) {
    return makeProxyIdentity(ensureIdentity(name))
  }

  /**
   * 创建表对象，该对象是可代理的，可以直接以 . 运算符获取下一节点Identifier
   * @param names
   */
  static table(...names: string[]) {
    return Expression.proxyIdentifier(Expression.identifier(...names))
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
  static invoke(func: UnsureIdentity, params: (Expressions | JsConstant)[]) {
    return new Invoke(func, params)
  }
}

Object.assign(Expression.prototype, ExpressionPrototype)

export interface ICondition {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: Conditions): Condition
  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup(condition: Conditions): Condition

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Conditions): Condition

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup(condition: Conditions): Condition
}

const ConditionPrototype: ICondition = {
  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and(condition: Conditions) {
    condition = ensureCondition(condition)
    return new BinaryLogicCondition(LogicOperator.AND, this, condition)
  },

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup(condition: Conditions) {
    condition = ensureCondition(condition)
    return new BinaryLogicCondition(LogicOperator.AND, this, Condition.quoted(condition))
  },

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or(condition: Conditions) {
    condition = ensureCondition(condition)
    return new BinaryLogicCondition(LogicOperator.OR, this, condition)
  },


  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  orGroup(condition: Conditions) {
    condition = ensureCondition(condition)
    return new BinaryLogicCondition(LogicOperator.OR, this, Condition.quoted(condition))
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
  and: (condition: Conditions) => Condition

  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup: (condition: Conditions) => Condition

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or: (condition: Conditions) => Condition

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup: (condition: Conditions) => Condition

  /**
   * 将多个查询条件通过 AND 合并成一个大查询条件
   * @static
   * @param conditions 查询条件列表
   * @returns 返回逻辑表达式
   */
  static and(...conditions: Conditions[]) {
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
  static or(...conditions: Conditions[]) {
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
   */
  static not(condition: Conditions) {
    condition = ensureCondition(condition)
    return new UnaryLogicCondition(LogicOperator.NOT, condition)
  }



  /**
   * 判断是否存在
   * @param select 查询语句
   */
  static exists(select: UnsureSelectExpressions) {
    return new UnaryCompareCondition(CompareOperator.EXISTS, AST.bracket(select))
  }

  /**
   * 比较运算
   * @private
   * @param left 左值
   * @param right 右值
   * @param operator 运算符
   * @returns 返回比较运算对比条件
   */
  static compare(left: UnsureExpressions, right: UnsureExpressions, operator: CompareOperator = CompareOperator.EQ) {
    return new BinaryCompareCondition(operator, left, right)
  }

  /**
   * 比较运算 =
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static eq(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.EQ)
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.NEQ)
  }

  /**
   * 比较运算 <
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lt(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.LT)
  }

  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.LTE)
  }

  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.GT)
  }

  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.GTE)
  }

  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static like(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.LIKE)
  }

  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static notLike(left: UnsureExpressions, right: UnsureExpressions) {
    return Condition.compare(left, right, CompareOperator.NOT_LIKE)
  }

  /**
   * 比较运算 IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static in(left: UnsureExpressions, values: UnsureGroupValues) {
    return Condition.compare(left, ensureGroupValues(values), CompareOperator.IN)
  }

  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn(left: UnsureExpressions, values: UnsureGroupValues) {
    return Condition.compare(left, ensureGroupValues(values), CompareOperator.NOT_IN)
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

  /**
   * 括号条件
   * @param condition 查询条件
   */
  static quoted(condition: Conditions) {
    return new BracketCondition(condition)
  }
}

Object.assign(Condition.prototype, ConditionPrototype)

/**
 * 二元逻辑查询条件条件
 */
export class BinaryLogicCondition extends Condition implements IBinary {
  operator: LogicOperator
  left: Conditions
  right: Conditions
  /**
   * 创建二元逻辑查询条件实例
   */
  constructor(operator: LogicOperator, left: UnsureConditions, right: UnsureConditions) {
    super(SqlSymbol.BINARY)
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
class UnaryLogicCondition extends Condition implements IUnary {
  operator: LogicOperator
  next: Conditions
  /**
   * 创建一元逻辑查询条件实例
   * @param operator
   * @param next
   */
  constructor(operator, next) {
    super(SqlSymbol.UNARY)
    this.operator = operator
    this.next = ensureCondition(next)
  }
}

/**
 * 二元比较条件
 */
class BinaryCompareCondition extends Condition {
  left: Expressions
  right: Expressions
  operator: CompareOperator
  /**
   * 构造函数
   */
  constructor(operator: CompareOperator, left: UnsureExpressions, right: UnsureExpressions) {
    super(SqlSymbol.BINARY)
    this.operator = operator
    this.left = ensureConstant(left)
    this.right = ensureConstant(right)
  }
}

/**
 * 一元比较条件
 */
class UnaryCompareCondition extends Condition implements IUnary {
  next: Expressions
  operator: CompareOperator
  /**
   * 一元比较运算符
   * @param operator 运算符
   * @param expr 查询条件
   */
  constructor(operator: CompareOperator, expr: UnsureExpressions) {
    super(SqlSymbol.UNARY)
    this.operator = operator
    assert(expr, 'next must not null')
    this.next = ensureConstant(expr)
  }
}

/**
 * IS NULL 运算
 */
class IsNullCondition extends UnaryCompareCondition {
  /**
   * @param next 表达式
   */
  constructor(next: UnsureExpressions) {
    super(CompareOperator.IS_NULL, next)
  }
}

/**
 * 是否为空值条件
 */
class IsNotNullCondition extends UnaryLogicCondition {
  /**
   * 是否空值
   * @param next 表达式
   */
  constructor(next: UnsureExpressions) {
    super(CompareOperator.IS_NOT_NULL, next)
  }
}

/**
 * 联接查询
 */
export class Join extends AST {
  readonly type: SqlSymbol
  left: boolean
  table: Identifier
  on: Conditions

  /**
   * 创建一个表关联
   * @param table
   * @param on 关联条件
   * @param left 是否左联接
   */
  constructor(table: UnsureIdentity, on: Conditions, left: boolean = false) {
    super(SqlSymbol.JOIN)

    /**
     * 关联表
    * @type {Table}
    */
    this.table = ensureIdentity(table)
    /**
     * 关联条件
    * @type {Conditions}
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
    super(SqlSymbol.RAW)
    this.sql = sql
  }
}

/**
 * 标识符，可以多级，如表名等
 */
export class Identifier extends Expression {

  // [name: string]: Identity

  public readonly name: string
  public readonly parent?: Identifier

  /**
   * 标识符
   */
  protected constructor(name: string, parent?: UnsureIdentity, type: SqlSymbol = SqlSymbol.IDENTIFIER) {
    super(type)
    this.name = name
    this.parent = ensureIdentity(parent)
  }

  get lvalue() {
    return true
  }

  /**
   * 访问下一节点
   * @param name
   */
  dot(name: string) {
    return new Identifier(name, this)
  }

  field(name: string) {
    return this.dot(name)
  }

  any() {
    return Identifier.any(this)
  }

  /**
   * 执行一个函数
   * @param params
   */
  invoke(...params: (UnsureExpressions)[]) {
    return new Invoke(this, params)
  }

  /**
   * 常规标识符
   */
  static normal(name) {
    return new Identifier(name)
  }

  /**
   * 内建标识符
   */
  static buildIn(name) {
    return new Identifier(name, null, SqlSymbol.BUILDIN_IDENTIFIER)
  }

  /**
   * 内建标识符
   */
  static any(parent?: UnsureIdentity) {
    return new Identifier('*', parent, SqlSymbol.BUILDIN_IDENTIFIER)
  }
}

export class Variant extends Expression {
  name: string

  constructor(name: string) {
    super(SqlSymbol.VARAINT)
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
  readonly expr: Expressions

  /**
   * 别名构造函数
   * @param expr 表达式或表名
   * @param name 别名
   */
  constructor(expr: UnsureExpressions, name: string) {
    super(name, null, SqlSymbol.ALIAS)
    assert(_.isString(name), 'The alias must type of string')
    // assertType(expr, [DbObject, Field, Constant, Select], 'alias must type of DbObject|Field|Constant|Bracket<Select>')
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

  params: Expressions[]

  /**
   * 函数调用
   */
  constructor(func: UnsureIdentity, params?: UnsureExpressions[]) {
    super(SqlSymbol.INVOKE)
    this.func = ensureIdentity(func)
    this.params = (params || []).map(expr => ensureConstant(expr))
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
  static insert(table: UnsureIdentity, fields?: UnsureIdentity[]) {
    return new Insert(table, fields)
  }

  /**
   * 更新一个表格
   * @param table
   */
  static update(table: UnsureIdentity) {
    return new Update(table).from(table)
  }

  /**
   * 删除一个表格
   * @param table 表格
   */
  static delete(table: UnsureIdentity) {
    return new Delete(table)
  }

  /**
   * 删除一个表格，delete的别名
   * @param table 表格
   */
  static del(table: UnsureIdentity) {
    return Statement.delete(table)
  }

  /**
   * 选择列
   */
  static select(columns: KeyValueObject): Select
  static select(columns: KeyValueObject): Select
  static select(...columns: UnsureExpressions[]): Select
  static select(...args) {
    return new Select(...args)
  }

  /**
   * 执行一个存储过程
   * @param proc
   * @param params
   */
  static execute(proc: UnsureIdentity, params?: UnsureExpressions[])
  static execute(proc: UnsureIdentity, params?: Parameter[])
  static execute(proc: UnsureIdentity, params?: UnsureExpressions[] | Parameter[]) {
    return new Execute(proc, params)
  }

  /**
   * 执行一个存储过程，execute的别名
   * @param proc 存储过程
   * @param params 参数
   */
  static exec(proc: UnsureIdentity, params: UnsureExpressions[])
  static exec(proc: UnsureIdentity, params: Parameter[])
  static exec(proc: UnsureIdentity, params: UnsureExpressions[] | Parameter[]) {
    return new Execute(proc, params)
  }

  /**
   * 赋值语句
   * @param left 左值
   * @param right 右值
   */
  static assign(left: Expression, right: UnsureExpressions) {
    return new Assignment(left, right)
  }

  /**
   * 变量声明
   * @param declares 变量列表
   */
  static declare(...declares) {
    return new Declare(...declares)
  }

  /**
   * WHEN 语句块
   * @param expr
   * @param value
   */
  static when(expr: UnsureExpressions, value?: UnsureExpressions) {
    return new When(expr, value)
  }
}

/**
 * When语句
 */
export class When extends AST {
  expr: Expressions
  value: Expressions

  constructor(expr: UnsureExpressions, value?: UnsureExpressions) {
    super(SqlSymbol.WHEN)
    this.expr = ensureConstant(expr)
    if (value) {
      this.value = ensureConstant(value)
    }
  }

  then(value: UnsureExpressions) {
    this.value = ensureConstant(value)
  }
}

/**
 * CASE表达式
 */
export class Case extends Expression {

  get lvalue() {
    return false
  }

  expr: Expressions
  whens: When[]
  defaults?: Expressions

  /**
   *
   * @param expr
   */
  constructor(expr: UnsureExpressions) {
    super(SqlSymbol.CASE)
    this.expr = ensureConstant(expr)
    /**
     * @type {When[]}
     */
    this.whens = []
  }

  /**
   * ELSE语句
   * @param defaults
   */
  else(defaults): this {
    this.defaults = ensureConstant(defaults)
    return this
  }

  /**
   * WHEN语句
   * @param expr
   * @param then
   */
  when(expr: UnsureExpressions, then): this {
    this.whens.push(
      new When(ensureConstant(expr), then)
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
    super(SqlSymbol.CONSTANT)
    this.value = value
  }
}

/**
 * 值列表（不含括号）
 */
export class ValueList extends AST {
  items: Expressions[]
  constructor(...values: UnsureExpressions[]) {
    super(SqlSymbol.VALUE_LIST)
    this.items = values.map(value => ensureConstant(value))
  }
}

/**
 * 括号引用
 */
export class Bracket<T extends AST> extends AST {
  /**
   * 表达式
   */
  context: T

  constructor(context: T) {
    super(SqlSymbol.BRACKET)
    this.context = context
  }
}

export class BracketExpression extends Bracket<Expressions | ValueList | Select> implements IExpression {

  /**
   * 加法运算
   */
  add: (expr: UnsureExpressions) => Expression

  /**
   * 减法运算
   */
  sub: (expr: UnsureExpressions) => Expression

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul: (expr: UnsureExpressions) => Expression

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div: (expr: UnsureExpressions) => Expression

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod: (expr: UnsureExpressions) => Expression


  and: (expr: UnsureExpressions) => Expression

  or: (expr: UnsureExpressions) => Expression

  not: (expr: UnsureExpressions) => Expression
  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl: (expr: UnsureExpressions) => Expression

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr: (expr: UnsureExpressions) => Expression

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte: (expr: UnsureExpressions) => Condition

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike: (expr: UnsureExpressions) => Condition

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in: (...values: UnsureExpressions[]) => Condition

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn: (...values: UnsureExpressions[]) => Condition

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull: () => Condition

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull: () => Condition

  /**
   * isNotNull 的简称别名
   * @returns 返回对比条件表达式
   */
  notNull: () => Condition

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc: () => SortInfo

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc: () => SortInfo

  /**
   * 为当前表达式添加别名
   */
  as: (alias: string) => Alias

}

export class BracketCondition extends Bracket<Conditions> implements ICondition {

  /**
   * and连接
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  and: (condition) => Condition

  /**
   * and连接，并在被连接的条件中加上括号 ()
   * @param condition 下一个查询条件
   * @returns 返回新的查询条件
   */
  andGroup: (condition: Conditions) => Condition

  /**
   * OR语句
   * @param condition
   * @returns 返回新的查询条件
   */
  or: (condition: Conditions) => Condition

  /**
   * or 连接，并在被连接的条件中加上括号 ()
   * @param condition
   * @returns 返回新的查询条件
   */
  orGroup: (condition: Conditions) => Condition

  /**
   * 返回括号表达式
   */
  quoted: () => Bracket<Conditions>
}

Object.assign(BracketCondition.prototype, ConditionPrototype)

export interface IBinary {
  operator: String
  left: AST
  right: AST
}

export interface IUnary {
  operator: String
  next: AST
}

/**
 * 二元运算表达式
 */
export class BinaryExpression extends Expression implements IBinary {

  get lvalue() {
    return false
  }

  operator: ComputeOperator
  left: Expressions
  right: Expressions

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
    this.operator = operator

    this.left = ensureConstant(left)
    this.right = ensureConstant(right)
  }
}

/**
 * - 运算符
 */
export class UnaryExpression extends Expression implements IUnary {

  operator: ComputeOperator
  next: Expressions
  readonly type: SqlSymbol

  get lvalue() {
    return false
  }
  /**
   * 一元运算目前只支持负数运算符
   * @param expr
   */
  constructor(operator: ComputeOperator, expr: UnsureExpressions) {
    super(SqlSymbol.UNARY)

    this.next = ensureConstant(expr)
  }
}

/**
 * 联接查询
 */
export class Union extends AST {
  select: UnsureSelectExpressions
  all: boolean
  /**
   *
   * @param select SELECT语句
   * @param all 是否所有查询
   */
  constructor(select, all) {
    super(SqlSymbol.UNION)
    this.select = select
    this.all = all
  }
}

// export interface SelectOptions {
//   from?: UnsureIdentity[],
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
  [key: string]: SortDirection
}

export abstract class Fromable extends Statement {
  tables?: Identifier[]
  joins?: Join[]
  filters?: Conditions

  /**
   * 从表中查询，可以查询多表
   * @param tables
   */
  from(...tables) {
    // assert(!this.$from, 'from已经声明')
    this.tables = tables.map(table => ensureIdentity(table))
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
  leftJoin(table: UnsureIdentity, on: Conditions) {
    return this.join(table, on, true)
  }

  /**
   * where查询条件
   * @param condition
   */
  where(condition: UnsureConditions) {
    assert(!this.filters, 'where is declared')
    if (_.isPlainObject(condition)) {
      condition = ensureCondition(condition)
    }
    // assert(condition instanceof Condition, 'Then argument condition must type of Condition')
    this.filters = condition as Conditions
    return this
  }
}

export class SortInfo extends AST {
  expr: Expressions
  direction?: SortDirection
  constructor(expr: UnsureExpressions, direction?: SortDirection) {
    super(SqlSymbol.SORT)
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
  columns: Expressions[]
  sorts?: SortInfo[]
  groups?: Expressions[]
  havings?: Conditions
  unions?: Union

  constructor(columns: object)
  constructor(...columns: UnsureExpressions[])
  constructor(...columns: (object | UnsureConditions)[])
  constructor(...columns: (object | UnsureConditions)[]/*options?: SelectOptions*/) {
    super(SqlSymbol.SELECT)
    if (columns.length === 1 && _.isPlainObject(columns[0])) {
      const obj = columns[0]
      this.columns = Object.entries(obj).map(([alias, expr]) => new Alias(ensureConstant(expr), alias))
      return
    }
    // 实例化
    this.columns = (columns as UnsureExpressions[]).map(expr => ensureConstant(expr))
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
  top(rows) {
    assert(_.isUndefined(this.tops), 'top is declared')
    this.tops = rows
    return this
  }

  /**
   * order by 排序
   * @param sorts 排序信息
   */
  orderBy(sorts: SortObject): this
  orderBy(...sorts: (SortInfo | UnsureExpressions)[]): this
  orderBy(...sorts: (SortObject | SortInfo | UnsureExpressions)[]): this {
    // assert(!this.$orders, 'order by clause is declared')
    assert(sorts.length > 0, 'must have one or more order basis')
    // 如果传入的是对象类型
    if (sorts.length === 1 && _.isPlainObject(sorts[0])) {
      const obj = sorts[0]
      this.sorts = Object.entries(obj).map(([expr, direction]) => (new SortInfo(expr, direction)))
      return this
    }
    sorts = sorts as (UnsureExpressions | SortInfo)[]
    this.sorts = sorts.map(
      expr => expr instanceof SortInfo ? expr : new SortInfo(expr as UnsureExpressions)
    )
    return this
  }

  /**
   * 分组查询
   * @param groups
   */
  groupBy(...groups: UnsureExpressions[]) {
    this.groups = groups.map(expr => ensureConstant(expr))
    return this
  }

  /**
   * Having 子句
   * @param condition
   */
  having(condition) {
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
  offset(rows) {
    this.offsets = rows
    return this
  }

  /**
   * 限定数
   * @param rows
   */
  limit(rows) {
    assert(_.isNumber(rows), 'The argument rows must type of Number')
    this.limits = rows
    return this
  }

  /**
   * 合并查询
   */
  union(select: UnsureSelectExpressions, all = false) {
    this.unions = new Union(select, all)
  }

  unionAll(select: UnsureSelectExpressions) {
    return this.union(select, true)
  }

  /**
   * 将本SELECT返回表达式
   * @returns 返回一个加()后的SELECT语句
   */
  quoted() {
    return new BracketExpression(this)
  }

  /**
   * 将本次查询，转换为Table行集
   * @param alias
   */
  as(alias) {
    return new Alias(this.quoted(), alias)
  }
}

/**
 * Insert 语句
 */
export class Insert extends Statement {

  table: Identifier
  fields: Identifier[]
  rows: GroupValues[] | Select

  /**
   * 构造函数
   */
  constructor(table: UnsureIdentity, fields?: UnsureIdentity[]) {
    super(SqlSymbol.INSERT)
    assert(!this.table, 'The into clause is declared')
    this.table = ensureIdentity(table)
    if (fields) {
      this._fields(...fields)
    }
    return this
  }


  /**
   * 字段列表
   * @param  {string[]|Field[]} fields
   */
  private _fields(...fields: UnsureIdentity[]) {
    assert(fields.length > 0, 'fields not allow empty.')
    /**
     * 字段列表
     */
    this.fields = fields.map(p => ensureIdentity(p))
    return this
  }

  values(select: Select): this
  values(row: ValuesObject): this
  values(row: UnsureExpressions[]): this
  values(...rows: UnsureExpressions[][]): this
  values(...rows: ValuesObject[]): this
  values(...args): this {
    assert(!this.rows, 'values is declared')
    assert(args.length > 0, 'rows must more than one elements.')
    // 单个参数
    if (args.length === 1) {
      // (select: Select)
      if (args[0] instanceof Select) {
        this.rows = args[0]
        return this
      }
      // (row: UnsureExpressions[])
      if (_.isArray(args[0])) {
        this.rows = [AST.list(...args[0])]
        return this
      }
    }

    // (rows: UnsureExpressions[][])
    if (args.length > 1 && _.isArray(args[0])) {
      this.rows = args.map(rowValues => AST.list(...rowValues))
      return this
    }

    // (row: ValueObject)
    // (rows: ValueObject[])
    if (!this.fields) {
      const existsFields = {}
      args.forEach(row => Object.keys(row).forEach(field => {
        if (!existsFields[field]) existsFields[field] = true
      }))
      this._fields(...Object.keys(existsFields))
    }

    this.rows = (args).map(row => {
      const rowValues = this.fields.map(field => (row as ValuesObject)[field.name])
      return AST.list(...rowValues)
    })
    return this
  }
}

// export interface UpdateOptions {
//   table?: UnsureIdentity
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }

export interface KeyValueObject {
  [field: string]: UnsureExpressions
}

export type ValuesObject = KeyValueObject
export type AssignObject = KeyValueObject

export class Update extends Fromable {
  table: Identifier
  sets: Assignment[]

  constructor(table: UnsureIdentity /*options?: UpdateOptions*/) {
    super(SqlSymbol.UPDATE)
    this.table = ensureIdentity(table)
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
//   table?: UnsureIdentity
//   sets?: object | Assignment[]
//   joins?: Join[]
//   where?: Conditions
// }

export class Delete extends Fromable {
  table: Identifier

  constructor(table: UnsureIdentity /*options?: DeleteOptions*/) {
    super(SqlSymbol.DELETE)
    this.table = ensureIdentity(table)
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
  params: Expressions[] | Parameter[] | Assignment[]
  constructor(proc: UnsureIdentity, params?: UnsureExpressions[])
  constructor(proc: UnsureIdentity, params?: Parameter[])
  constructor(proc: UnsureIdentity, params?: UnsureExpressions[] | Parameter[])
  constructor(proc: UnsureIdentity, params?: UnsureExpressions[] | Parameter[]) {
    super(SqlSymbol.EXECUTE)
    this.proc = ensureIdentity(proc)
    if (!params || params.length === 0) {
      this.params = []
      return
    }

    if (!(params[0] instanceof Parameter)) {
      this.params = (params as UnsureExpressions[]).map(expr => ensureConstant(expr))
    }

    this.params = params as Parameter[]
  }
}

/**
 * 赋值语句
 */
export class Assignment extends Statement {
  left: Expression
  right: Expressions

  constructor(left: Expression, right: UnsureExpressions) {
    super(SqlSymbol.ASSIGNMENT)
    assert(left.lvalue, 'Argument left not lvalue')
    this.left = left
    this.right = ensureConstant(right)
  }
}

class VariantDeclare extends AST {
  constructor(name: string, dataType: string) {
    super(SqlSymbol.VARAINT_DECLARE)
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
    super(SqlSymbol.DECLARE)
    this.declares = declares
  }
}

type DbType = string

/**
 * 程序与数据库间传递值所使用的参数
 */
export class Parameter extends Expression {
  name?: string
  private _value?: JsConstant
  direction: ParameterDirection
  dbType?: DbType
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

  constructor(name: string, dbType: DbType, value: JsConstant, direction: ParameterDirection = ParameterDirection.INPUT) {
    super(SqlSymbol.PARAMETER)
    this.name = name
    this.value = value // ensureConstant(value)
    this.dbType = dbType
    this.direction = direction
  }

  /**
   * input 参数
   */
  static input(name: string, value: JsConstant) {
    return new Parameter(name, null, value, ParameterDirection.INPUT)
  }

  /**
   * output参数
   */
  static output(name: string, type: DbType, value?: JsConstant) {
    return new Parameter(name, type, value, ParameterDirection.OUTPUT)
  }
}

/**
 * SQL 文档
 */
export class Document extends AST {
  statements: Statement[]
  constructor(...statements: Statement[]) {
    super(SqlSymbol.DOCUMENT)
    this.statements = statements
  }
}

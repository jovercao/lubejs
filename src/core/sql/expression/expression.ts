import { SQL, SQL_SYMBOLE } from '../sql';
import type { Interger, Numeric, Scalar } from '../scalar';
import type { DbType, ScalarFromDbType } from '../db-type';

/**
 * 可兼容JS常量的表达式
 */
export type XExpression<T extends Scalar = Scalar> = Expression<T> | T;

/**
 * 表达式基类，抽象类，
 * 所有表达式类均从该类型继承，
 * 可以直接使用 instanceof 来判断是否为expression
 */
export abstract class Expression<T extends Scalar = Scalar>
  extends SQL
  implements Expression
{
  $tag: SQL_SYMBOLE.EXPRESSION = SQL_SYMBOLE.EXPRESSION;
  /**
   * 字符串连接运算
   */
  concat(expr: XExpression<string>): Expression<string> {
    return SQL.concat(this as XExpression<string>, expr);
  }

  /**
   * 加法运算，返回数值，如果是字符串相连接，请使用join函数
   */
  add(expr: XExpression<T>): Expression<T> {
    return SQL.add(this as any, expr as any);
  }

  /**
   * 减法运算
   */
  sub(expr: XExpression<T>): Expression<T> {
    return SQL.sub(this as any, expr as any);
  }

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: XExpression<T>): Expression<T> {
    return SQL.mul(this as any, expr as any);
  }

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: XExpression<T>): Expression<T> {
    return SQL.div(this as any, expr as any);
  }

  /**
   * 取模运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: XExpression<T>): Expression<T> {
    return SQL.mod(this as any, expr);
  }

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: XExpression<Interger>): Expression<Interger> {
    return SQL.and(this as any, expr);
  }

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: XExpression<Interger>): Expression<Interger> {
    return SQL.or(this as any, expr);
  }

  // /**
  //  * 位运算 ~
  //  * @param expr 要与当前表达式相除的表达式
  //  * @returns 返回运算后的表达式
  //  */
  // not(): Expression<T> {
  //   return UnaryOperation.not(this as any) as any
  // }

  /**
   * 位运算 ^
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  xor(expr: XExpression<Interger>): Expression<Interger> {
    return SQL.xor(this as any, expr as any);
  }

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: XExpression<Interger>): Expression<T> {
    return SQL.shl(this as any, expr);
  }

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(bits: XExpression<Interger>): Expression<T> {
    return SQL.shr(this as any, bits);
  }

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: XExpression<T>): Condition {
    return SQL.eq(this, expr);
  }

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: XExpression<T>): Condition {
    return BinaryCompareCondition.neq(this, expr);
  }

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: XExpression<T>): Condition {
    return BinaryCompareCondition.lt(this, expr);
  }

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: XExpression<T>): Condition {
    return BinaryCompareCondition.lte(this, expr);
  }

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: XExpression<T>): Condition {
    return BinaryCompareCondition.gt(this, expr);
  }

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: XExpression<T>): Condition {
    return BinaryCompareCondition.gte(this, expr);
  }

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: XExpression<string>): Condition {
    return BinaryCompareCondition.like(this as XExpression<string>, expr);
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: XExpression<string>): Condition {
    return BinaryCompareCondition.notLike(this as XExpression<string>, expr);
  }

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(select: Select<any>): Condition;
  in(values: XExpression<T>[]): Condition;
  in(...values: XExpression<T>[]): Condition;
  in(
    ...values: XExpression<T>[] | [Select<any>] | [XExpression<T>[]]
  ): Condition {
    if (
      values.length === 1 &&
      (Select.isSelect(values[0]) || Array.isArray(values[0]))
    ) {
      return BinaryCompareCondition.in(this, values[0] as any);
    }
    return BinaryCompareCondition.in(this, values as any);
  }

  /**
   * 比较是否不包含于 NOT IN
   * @param values 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notIn(select: Select<any>): Condition;
  notIn(values: XExpression<T>[]): Condition;
  notIn(...values: XExpression<T>[]): Condition;
  notIn(
    ...values: XExpression<T>[] | [Select<any>] | [XExpression<T>[]]
  ): Condition {
    if (
      values.length === 1 &&
      (Select.isSelect(values[0]) || Array.isArray(values[0]))
    ) {
      return BinaryCompareCondition.notIn(this, values[0] as any);
    }
    return BinaryCompareCondition.notIn(this, values as any);
  }

  /**
   * 比较是否为空 IS NULL
   * @returns 返回对比条件表达式
   */
  isNull(): Condition {
    return UnaryCompareCondition.isNull(this);
  }

  /**
   * 比较是否为空 IS NOT NULL
   * @returns 返回对比条件表达式
   */
  isNotNull(): Condition {
    return UnaryCompareCondition.isNotNull(this);
  }

  /**
   * 正序
   * @returns 返回对比条件表达式
   */
  asc(): Sort {
    return new Sort(this, 'ASC');
  }

  /**
   * 倒序
   * @returns 返回对比条件表达式
   */
  desc(): Sort {
    return new Sort(this, 'DESC');
  }

  /**
   * 将表达式转换为列，并指定列名
   */
  as<N extends string>(name: N): SelectColumn<T, N> {
    return new SelectColumn<T, N>(name, this);
  }

  // /**
  //  * 将本表达式括起来
  //  */
  // group(): Expression<T> {
  //   return new GroupExpression(this);
  // }

  /**
   * 将当前表达式转换为指定的类型
   */
  to<T extends DbType>(type: T): Expression<ScalarFromDbType<T>> {
    return SQL.std.convert(this, type);
  }

  static isExpression(object: any): object is Expression {
    return object?.$tag === SQL_SYMBOLE.EXPRESSION;
  }

  static ensureExpression<T extends Scalar>(value: XExpression<T>): Expression<T> {
    return Expression.isExpression(value) ? value : Literal.ensureLiteral(value);
  }
}
// 避免循环引用问题
import {
  BinaryCompareCondition,
  UnaryCompareCondition,
  Condition,
} from '../condition';
import { Select, SelectColumn, Sort } from '../statement';import { Literal } from './literal'


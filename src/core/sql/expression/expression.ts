import { Interger, Numeric, Scalar } from '../scalar';
import { SQL, SQL_SYMBOLE } from '../sql';
import { Condition } from '../condition/condition';
import { DbType, TsTypeOf } from '../db-type';
import { Select } from '../statement/crud/select';
import { SelectColumn } from '../statement/crud/select-column';
import { Sort } from '../statement/crud/sort';
import { BinaryOperation } from './binary-operation';
import { UnaryOperation } from './unary-operation';
import { BinaryCompareCondition, UnaryCompareCondition } from '../condition';
import { Literal } from './literal';
import { GroupExpression } from './group-expression';
import { StandardExpression } from './standard-expression';
import {
  BINARY_OPERATION_OPERATOR,
  UNARY_OPERATION_OPERATOR,
} from './common/operation';
import { Variant } from './variant';
import { CompatibleRowset } from '../rowset';
import { Field } from './field';

/**
 * 可兼容的表达式
 */
export type CompatibleExpression<T extends Scalar = Scalar> = Expression<T> | T;

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
  concat(expr: CompatibleExpression<string>): Expression<string> {
    return Expression.concat(this as CompatibleExpression<string>, expr);
  }

  /**
   * 加法运算，返回数值，如果是字符串相连接，请使用join函数
   */
  add(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.add(this as any, expr as any);
  }

  /**
   * 减法运算
   */
  sub(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.sub(this as any, expr as any);
  }

  /**
   * 乘法运算
   * @param expr 要与当前表达式相乘的表达式
   */
  mul(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.mul(this as any, expr as any);
  }

  /**
   * 除法运算
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  div(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.div(this as any, expr as any);
  }

  /**
   * 算术运算 %
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  mod(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.mod(this as any, expr);
  }

  /**
   * 位运算 &
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  and(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.and(this as any, expr);
  }

  /**
   * 位运算 |
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  or(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.or(this as any, expr);
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
  xor(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.xor(this as any, expr as any);
  }

  /**
   * 位运算 <<
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shl(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.shl(this as any, expr as any);
  }

  /**
   * 位运算 >>
   * @param expr 要与当前表达式相除的表达式
   * @returns 返回运算后的表达式
   */
  shr(expr: CompatibleExpression<T>): Expression<T> {
    return Expression.shr(this as any, expr as any);
  }

  /**
   * 比较是否相等 =
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  eq(expr: CompatibleExpression<T>): Condition {
    return BinaryCompareCondition.eq(this, expr);
  }

  /**
   * 比较是否不等于 <>
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  neq(expr: CompatibleExpression<T>): Condition {
    return BinaryCompareCondition.neq(this, expr);
  }

  /**
   * 比较是否小于 <
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lt(expr: CompatibleExpression<T>): Condition {
    return BinaryCompareCondition.lt(this, expr);
  }

  /**
   * 比较是否小于等于 <=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  lte(expr: CompatibleExpression<T>): Condition {
    return BinaryCompareCondition.lte(this, expr);
  }

  /**
   * 比较是否大于 >
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gt(expr: CompatibleExpression<T>): Condition {
    return BinaryCompareCondition.gt(this, expr);
  }

  /**
   * 比较是否小于等于 >=
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  gte(expr: CompatibleExpression<T>): Condition {
    return BinaryCompareCondition.gte(this, expr);
  }

  /**
   * 比较是相像 LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  like(expr: CompatibleExpression<string>): Condition {
    return BinaryCompareCondition.like(
      this as CompatibleExpression<string>,
      expr
    );
  }

  /**
   * 比较是否不想像 NOT LIKE
   * @param expr 要与当前表达式相比较的表达式
   * @returns 返回对比条件表达式
   */
  notLike(expr: CompatibleExpression<string>): Condition {
    return BinaryCompareCondition.notLike(
      this as CompatibleExpression<string>,
      expr
    );
  }

  /**
   * 比较是否不包含于 IN
   * @param values 要与当前表达式相比较的表达式数组
   * @returns 返回对比条件表达式
   */
  in(select: Select<any>): Condition;
  in(values: CompatibleExpression<T>[]): Condition;
  in(...values: CompatibleExpression<T>[]): Condition;
  in(
    ...values:
      | CompatibleExpression<T>[]
      | [Select<any>]
      | [CompatibleExpression<T>[]]
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
  notIn(values: CompatibleExpression<T>[]): Condition;
  notIn(...values: CompatibleExpression<T>[]): Condition;
  notIn(
    ...values:
      | CompatibleExpression<T>[]
      | [Select<any>]
      | [CompatibleExpression<T>[]]
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
  to<T extends DbType>(type: T): Expression<TsTypeOf<T>> {
    return SQL.std.convert(this, type);
  }

  static isExpression(object: any): object is Expression {
    return object?.$tag === SQL_SYMBOLE.EXPRESSION;
  }

  /**
   * 返回表达式
   */
  static ensure<T extends Scalar>(
    expr: CompatibleExpression<T> | undefined
  ): Expression<T> {
    if (!Expression.isExpression(expr)) {
      const value: Scalar = expr ?? null;
      return Literal.ensureLiterial<Scalar>(value);
    }
    return expr;
  }
}

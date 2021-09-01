import { CompatibleExpression, Expression } from '../expression/expression';
import { Scalar } from '../scalar';
import { Select } from '../statement/crud/select';
import {
  BINARY_COMPARE_OPERATOR,
  Condition,
  CONDITION_KIND,
} from './condition';

/**
 * 二元比较条件
 */
export class BinaryCompareCondition extends Condition {
  $left: Expression<Scalar>;
  $right: Expression<Scalar> | Expression<Scalar>[];
  $operator: BINARY_COMPARE_OPERATOR;
  $kind: CONDITION_KIND.BINARY_COMPARE = CONDITION_KIND.BINARY_COMPARE;

  /**
   * 构造函数
   */
  constructor(
    operator: BINARY_COMPARE_OPERATOR,
    left: CompatibleExpression<Scalar>,
    right: CompatibleExpression<Scalar> | CompatibleExpression<Scalar>[]
  ) {
    super();
    this.$operator = operator;
    this.$left = Expression.ensure(left);
    if (Array.isArray(right)) {
      this.$right = right.map(expr => Expression.ensure(expr));
    } else {
      this.$right = Expression.ensure(right);
    }
  }

  static eq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.EQ, left, right);
  }

  /**
   * 比较运算 <>
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static neq<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.NEQ, left, right);
  }

  static isBinaryCompareCondition(
    object: any
  ): object is BinaryCompareCondition {
    return (
      Condition.isCondition(object) &&
      object.$kind === CONDITION_KIND.BINARY_COMPARE
    );
  }

  static lt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LT, left, right);
  }
  /**
   * 比较运算 <=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static lte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.LTE, left, right);
  }
  /**
   * 比较运算 >
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gt<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GT, left, right);
  }
  /**
   * 比较运算 >=
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static gte<T extends Scalar>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Condition {
    return new BinaryCompareCondition(BINARY_COMPARE_OPERATOR.GTE, left, right);
  }
  /**
   * 比较运算 LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static like(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.LIKE,
      left,
      right
    );
  }
  /**
   * 比较运算 NOT LIKE
   * @param left 左值
   * @param right 右值
   * @returns 返回比较运算对比条件
   */
  static notLike(
    left: CompatibleExpression<string>,
    right: CompatibleExpression<string>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_LIKE,
      left,
      right
    );
  }

  static in<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[] | Select<any>
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.IN,
      left,
      Select.isSelect(values)
        ? values.asValue()
        : values.map(v => Expression.ensure(v))
    );
  }
  /**
   * 比较运算 NOT IN
   * @param left 左值
   * @param values 要比较的值列表
   * @returns 返回比较运算对比条件
   */
  static notIn<T extends Scalar>(
    left: CompatibleExpression<T>,
    values: CompatibleExpression<T>[]
  ): Condition {
    return new BinaryCompareCondition(
      BINARY_COMPARE_OPERATOR.NOT_IN,
      left,
      values.map(v => Expression.ensure(v))
    );
  }
}

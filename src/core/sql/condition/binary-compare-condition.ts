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

  static isBinaryCompareCondition(
    object: any
  ): object is BinaryCompareCondition {
    return (
      Condition.isCondition(object) &&
      object.$kind === CONDITION_KIND.BINARY_COMPARE
    );
  }
}

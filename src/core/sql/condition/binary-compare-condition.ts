import { Scalar } from '../scalar';
import { SQL } from '../sql';
import { XExpression, Expression } from '../expression';
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
    left: XExpression<Scalar>,
    right: XExpression<Scalar> | XExpression<Scalar>[]
  ) {
    super();
    this.$operator = operator;
    this.$left = Expression.isExpression(left) ? left : SQL.literal(left);
    if (Array.isArray(right)) {
      this.$right = right.map(expr =>
        Expression.isExpression(expr) ? expr : SQL.literal(expr)
      );
    } else {
      this.$right = Expression.isExpression(right) ? right : SQL.literal(right);
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

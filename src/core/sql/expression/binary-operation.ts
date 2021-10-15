import { Scalar } from '../scalar';
import { SQL } from '../sql';
import { XExpression, Expression } from './expression';
import {
  BINARY_OPERATION_OPERATOR,
  Operation,
  OPERATION_KIND,
} from './common/operation';

/**
 * 二元运算表达式
 */
export class BinaryOperation<T extends Scalar = Scalar> extends Operation<T> {
  readonly $kind: OPERATION_KIND.BINARY = OPERATION_KIND.BINARY;
  $left: Expression<T>;
  $right: Expression<T>;
  $operator: BINARY_OPERATION_OPERATOR;
  static isBinaryOperation(object: any): object is BinaryOperation {
    return (
      Operation.isOperation(object) && object.$kind === OPERATION_KIND.BINARY
    );
  }

  /**
   * 名称
   */
  constructor(
    operator: BINARY_OPERATION_OPERATOR,
    left: XExpression<T>,
    right: XExpression<T>
  ) {
    super();
    this.$operator = operator;
    this.$left = Expression.isExpression(left) ? left : SQL.literal(left);
    this.$right = Expression.isExpression(right) ? right : SQL.literal(right);
  }
}

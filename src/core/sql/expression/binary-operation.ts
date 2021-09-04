import { Numeric, Scalar, Interger } from '../scalar';
import {
  BINARY_OPERATION_OPERATOR,
  Operation,
  OPERATION_KIND,
} from './common/operation';
import { CompatibleExpression, Expression } from './expression';

/**
 * 二元运算表达式
 */
export class BinaryOperation<T extends Scalar = Scalar> extends Operation<T> {
  readonly $kind: OPERATION_KIND.BINARY = OPERATION_KIND.BINARY;
  $left: Expression<T>;
  $right: Expression<T>;
  $operator: BINARY_OPERATION_OPERATOR;
  static isBinaryOperation(object: any): object is BinaryOperation {
    return Operation.isOperation(object) && object.$kind === OPERATION_KIND.BINARY;
  }

  /**
   * 名称
   */
  constructor(
    operator: BINARY_OPERATION_OPERATOR,
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ) {
    super();
    this.$operator = operator;
    this.$left = Expression.ensure(left);
    this.$right = Expression.ensure(right);
  }
}

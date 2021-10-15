import { Scalar } from '../scalar';
import { SQL } from '../sql';
import {
  Operation,
  OPERATION_KIND,
  UNARY_OPERATION_OPERATOR,
} from './common/operation';
import { XExpression, Expression } from './expression';

/**
 * 一元运算符
 */
export class UnaryOperation<T extends Scalar = Scalar> extends Operation<T> {
  readonly $value: Expression<Scalar>;
  readonly $kind: OPERATION_KIND.UNARY = OPERATION_KIND.UNARY;
  readonly $operator: UNARY_OPERATION_OPERATOR;
  static isUnaryOperation(object: any): object is UnaryOperation {
    return (
      Operation.isOperation(object) && object.$kind === OPERATION_KIND.UNARY
    );
  }

  /**
   * 一元运算
   * @param value
   */
  constructor(operator: UNARY_OPERATION_OPERATOR, value: XExpression<Scalar>) {
    super();
    this.$operator = operator;
    this.$value = Expression.isExpression(value) ? value : SQL.literal(value);
  }
}

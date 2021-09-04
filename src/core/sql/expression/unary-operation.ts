import { Interger } from '../scalar';
import { Scalar } from '../scalar';
import {
  Operation,
  OPERATION_KIND,
  UNARY_OPERATION_OPERATOR,
} from './common/operation';
import { CompatibleExpression, Expression } from './expression';

/**
 * 一元运算符
 */
export class UnaryOperation<T extends Scalar = Scalar> extends Operation<T> {
  readonly $value: Expression<Scalar>;
  readonly $kind: OPERATION_KIND.UNARY = OPERATION_KIND.UNARY;
  readonly $operator: UNARY_OPERATION_OPERATOR;
  static isUnaryOperation(object: any): object is UnaryOperation {
    return Operation.isOperation(object) && object.$kind === OPERATION_KIND.UNARY;
  }

  /**
   * 一元运算
   * @param value
   */
  constructor(
    operator: UNARY_OPERATION_OPERATOR,
    value: CompatibleExpression<Scalar>
  ) {
    super();
    this.$operator = operator;
    this.$value = Expression.ensure(value);
  }
}

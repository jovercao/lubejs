import { Scalar } from '../../scalar';
import { CompatibleExpression, Expression } from '../expression';
import { Assignment } from '../../statement/programmer/assignment';

export abstract class Assignable<T extends Scalar = any> extends Expression<T> {
  readonly $lvalue: true = true;
  /**
   * 赋值操作
   * @param left 左值
   * @param right 右值
   */
  set(value: CompatibleExpression<T>): Assignment<T> {
    return new Assignment(this, value);
  }
}

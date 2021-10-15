import { Scalar } from '../../scalar';
import { XExpression, Expression } from '../expression';

export abstract class Assignable<T extends Scalar = any> extends Expression<T> {
  readonly $lvalue: true = true;
  /**
   * 赋值操作
   * @param left 左值
   * @param right 右值
   */
  set(value: XExpression<T>): Assignment<T> {
    return new Assignment(this, value);
  }
}

import { Assignment } from '../../statement';

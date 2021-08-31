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

  /**
   * 字符串连接运算
   */
  static concat(
    ...strs: [
      CompatibleExpression<string>,
      CompatibleExpression<string>,
      ...CompatibleExpression<string>[]
    ]
  ): Expression<string> {
    let exp = strs[0];
    for (let i = 1; i < strs.length; i++) {
      exp = new BinaryOperation(BINARY_OPERATION_OPERATOR.CONCAT, exp, strs[i]);
    }
    return exp as Expression<string>;
  }

  /**
   * 算术运算 +
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static add<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.ADD, left, right);
  }

  /**
   * 算术运算 -
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static sub<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SUB, left, right);
  }

  /**
   * 算术运算 *
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mul<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MUL, left, right);
  }

  /**
   * 算术运算 /
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static div<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.DIV, left, right);
  }

  /**
   * 算术运算 %
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static mod<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.MOD, left, right);
  }
  /*
   * 位算术运算 ^
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static xor<T extends Numeric>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.XOR, left, right);
  }

  /**
   * 位算术运算 << 仅支持整型
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shl<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHL, left, right);
  }

  /**
   * 位算术运算 >>
   * @param left 左值
   * @param right 右值
   * @returns 返回算术运算表达式
   */
  static shr<T extends Interger>(
    left: CompatibleExpression<T>,
    right: CompatibleExpression<T>
  ): Expression<T> {
    return new BinaryOperation(BINARY_OPERATION_OPERATOR.SHR, left, right);
  }

  static and<T extends Interger>(left: CompatibleExpression<T>, right: CompatibleExpression<T>): Expression<T> {
    return new BinaryOperation(
      BINARY_OPERATION_OPERATOR.AND,
      left,
      right
    );
  }

  static or<T extends Interger>(left: CompatibleExpression<T>, right: CompatibleExpression<T>): Expression<T> {
    return new BinaryOperation(
      BINARY_OPERATION_OPERATOR.OR,
      left,
      right
    );
  }
}

import { SQL_SYMBOLE } from '../sql';
import { Scalar } from '../scalar/scalar';
import { CompatibleExpression, Expression } from './expression';

/**
 * 括号表达式
 */
export class GroupExpression<T extends Scalar = Scalar> extends Expression<T> {
  $type: SQL_SYMBOLE.GROUP_EXPRESSION = SQL_SYMBOLE.GROUP_EXPRESSION;
  $inner: Expression<T>;
  static isGroupExpression(object: any): object is GroupExpression {
    return object?.$type === SQL_SYMBOLE.GROUP_EXPRESSION;
  }
  constructor(inner: CompatibleExpression<T>) {
    super();
    this.$inner = Expression.ensure(inner);
  }
}

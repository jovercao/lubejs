import { SQL, SQL_SYMBOLE } from '../sql';
import { Scalar } from '../scalar/scalar';
import { XExpression, Expression } from './expression';

/**
 * 括号表达式
 */
export class GroupExpression<T extends Scalar = Scalar> extends Expression<T> {
  readonly $type: SQL_SYMBOLE.GROUP_EXPRESSION = SQL_SYMBOLE.GROUP_EXPRESSION;
  $inner: Expression<T>;
  static isGroupExpression(object: any): object is GroupExpression {
    return object?.$type === SQL_SYMBOLE.GROUP_EXPRESSION;
  }
  constructor(inner: XExpression<T>) {
    super();
    this.$inner = Expression.isExpression(inner) ? inner : SQL.literal(inner);
  }
}

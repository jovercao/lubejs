import { SQL, SQL_SYMBOLE } from '../sql';
import { XExpression, Expression } from './expression';
import { Scalar } from '../scalar';

/**
 * When语句
 */
export class When<T extends Scalar = any> extends SQL {
  $expr: Expression<Scalar> | Condition;
  $value: Expression<T>;
  readonly $type: SQL_SYMBOLE.WHEN = SQL_SYMBOLE.WHEN;

  constructor(expr: XExpression<Scalar> | Condition, then: XExpression<T>) {
    super();
    if (Expression.isExpression(expr) || Condition.isCondition(expr)) {
      this.$expr = expr;
    } else if (!Expression.isExpression(expr)) {
      this.$expr = SQL.literal(expr);
    } else {
      this.$expr = expr;
    }
    this.$value = Expression.isExpression(then) ? then : SQL.literal(then);
  }
}

import { Condition } from '../condition';
